"use client";

import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/stripe';
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Loader2,
  Save,
  Star,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  compare_at_price: null,
  images: [],
  colors: [],
  category: 'clutch',
  stock: 1,
  featured: false,
  material: 'Hand-crocheted yarn',
  dimensions: '',
  care: 'Spot clean gently with cold water.',
};

const CATS = [
  { value: 'clutch', label: 'clutch' },
  { value: 'beach bags', label: 'beach bags' },
  { value: 'ibiza', label: 'ibiza' },
  { value: 'custom', label: 'custom' },
  { value: 'mini', label: 'mini' },
  { value: 'shoulder', label: 'shoulder' },
  { value: 'crossbody', label: 'crossbody' },
];

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'blue', hex: '#073763' },
  { label: 'Black', value: 'black', hex: '#000000' },
  { label: 'Grey', value: 'grey', hex: '#5d5d5d' },
  { label: 'Brown', value: 'brown', hex: '#6b4b38' },
  { label: 'Burgundy', value: 'burgundy', hex: '#8b2638' },
  { label: 'Red', value: 'red', hex: '#d51f28' },
  { label: 'Beige', value: 'beige', hex: '#efe8de' },
  { label: 'Pink', value: 'pink', hex: '#f3b8c1' },
  { label: 'Purple', value: 'purple', hex: '#7c5cff' },
  { label: 'Lilac', value: 'lilac', hex: '#c8a2ff' },
  { label: 'White', value: 'white', hex: '#f7f3ed' },
  { label: 'Natural', value: 'natural', hex: '#e8dfd1' },
  { label: 'Green', value: 'green', hex: '#1f6b3a' },
  { label: 'Yellow', value: 'yellow', hex: '#f2d13b' },
  { label: 'Orange', value: 'orange', hex: '#ef5b18' },
];

function normalizeColors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => String(item).trim()).filter(Boolean)));
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
      {children}
    </span>
  );
}

const inputClass =
  'w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-neutral-950 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5';

function normalizeImages(images: unknown): string[] {
  return Array.isArray(images)
    ? images.map((image) => (typeof image === 'string' ? image.trim() : '')).filter(Boolean)
    : [];
}

export default function AdminProducts() {
  const { adminKey } = useAdmin();
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-key': adminKey,
  };

  function updateColors(colors: string[]) {
    setEditing((current) => ({ ...(current || {}), colors: normalizeColors(colors) }));
  }

  function toggleColor(color: string) {
    const current = normalizeColors(editing?.colors);
    updateColors(current.includes(color) ? current.filter((item) => item !== color) : [...current, color]);
  }

  async function load() {
    const response = await fetch('/api/products', {
      headers: { 'x-admin-key': adminKey },
      cache: 'no-store',
    });
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (!adminKey) return;
    load();
  }, [adminKey]);

  async function save() {
    const price = Number(editing?.price);
    if (!editing?.name?.trim() || !Number.isFinite(price) || price < 0) {
      return toast.error('Name and valid price are required');
    }

    setSaving(true);
    const response = await fetch('/api/products', {
      method: editing.id ? 'PATCH' : 'POST',
      headers,
      body: JSON.stringify({ ...editing, images: normalizeImages(editing.images) }),
    });
    const data = await response.json().catch(() => null);
    setSaving(false);

    if (response.ok) {
      toast.success('Product saved');
      setEditing(null);
      load();
    } else {
      toast.error(data?.error || 'Error saving product');
    }
  }

  async function del(id: string) {
    if (!confirm('Delete product?')) return;
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey },
    });
    response.ok ? (toast.success('Deleted'), load()) : toast.error('Delete failed');
  }

  async function persistImages(productId: string | undefined, images: string[]) {
    if (!productId) return true;

    const cleanImages = normalizeImages(images);
    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: productId, images: cleanImages }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      toast.error(data?.error || 'Could not save image gallery');
      return false;
    }

    setItems((current) =>
      current.map((product) => (product.id === productId ? { ...product, images: cleanImages } : product))
    );
    setEditing((current) => (current?.id === productId ? { ...current, images: cleanImages } : current));
    return true;
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || uploading) return;

    if (!file.type.startsWith('image/')) {
      if (fileRef.current) fileRef.current.value = '';
      return toast.error('Select an image file');
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
      body: fd,
    });
    const data = await response.json().catch(() => null);
    setUploading(false);

    if (response.ok && data?.url) {
      const currentImages = normalizeImages(editing?.images);
      const nextImages = [data.url, ...currentImages.filter((image) => image !== data.url)];
      setEditing((current) => ({ ...(current || {}), images: nextImages }));
      const saved = await persistImages(editing?.id, nextImages);
      toast.success(saved && editing?.id ? 'Image added and visible on site' : 'Image added. Save the new product to publish it.');
    } else {
      toast.error(data?.error || 'Upload error');
    }

    if (fileRef.current) fileRef.current.value = '';
  }

  async function setImageAsCover(index: number) {
    if (!editing) return;
    const images = normalizeImages(editing.images);
    if (!images.length) return;
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  async function moveImage(index: number, direction: -1 | 1) {
    if (!editing) return;
    const images = normalizeImages(editing.images);
    if (!images.length) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  async function removeImage(img: string) {
    if (!editing) return;
    const images = normalizeImages(editing.images).filter((x) => x !== img);
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  if (loading) {
    return (
      <div className="h-64 grid place-items-center">
        <Loader2 className="animate-spin text-[#b99a5f]" />
      </div>
    );
  }

  return (
    <div className="text-neutral-950">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-neutral-950">Products</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Create products, edit stock and manage the product gallery. The first image is used as the cover image on the shop and homepage.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c3a368] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-neutral-950 shadow-sm transition hover:bg-[#b59455]"
        >
          <Plus size={15} /> New product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-white">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center border-b border-neutral-100 text-4xl font-black tracking-tight text-neutral-100">
                  Balisa
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between gap-4">
                <h3 className="font-serif text-2xl text-neutral-950">{product.name}</h3>
                <b className="text-[#9b7637]">{formatPrice(product.price)}</b>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[.16em] text-neutral-400">
                {product.category} · stock {product.stock} {product.featured ? '· featured' : ''}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">{product.description}</p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setEditing({ ...product })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-[.14em] transition hover:opacity-85"
                  style={{ backgroundColor: '#151515', color: '#ffffff' }}
                >
                  <Pencil size={13} /> <span style={{ color: '#ffffff' }}>Edit</span>
                </button>
                <button onClick={() => del(product.id)} className="rounded-xl bg-red-50 px-4 text-red-600 transition hover:bg-red-100">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-neutral-950/45 p-3 backdrop-blur-sm sm:p-4">
          <div className="w-full max-w-6xl overflow-hidden rounded-[28px] border border-neutral-200 bg-white text-neutral-950 shadow-2xl">
            <div className="flex items-start justify-between gap-5 border-b border-neutral-200 bg-white px-5 py-5 sm:px-7">
              <div>
                <h2 className="font-serif text-3xl text-neutral-950">{editing.id ? 'Edit product' : 'New product'}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-neutral-400">
                  First image = product cover on the site
                </p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
                aria-label="Close editor"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(94vh-92px)] overflow-y-auto bg-white">
              <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:p-7">
                <section className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-5 border-b border-neutral-100 pb-4">
                    <h3 className="text-lg font-semibold text-neutral-950">Product details</h3>
                    <p className="mt-1 text-sm text-neutral-500">Main information shown on the product page.</p>
                  </div>

                  <div className="grid gap-5">
                    <label>
                      <FieldLabel>Name</FieldLabel>
                      <input className={inputClass} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                    </label>

                    <label>
                      <FieldLabel>Description</FieldLabel>
                      <textarea
                        rows={5}
                        className={inputClass}
                        value={editing.description || ''}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label>
                        <FieldLabel>Price EUR</FieldLabel>
                        <input
                          type="number"
                          className={inputClass}
                          value={editing.price ?? 0}
                          onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                        />
                      </label>
                      <label>
                        <FieldLabel>Compare at</FieldLabel>
                        <input
                          type="number"
                          className={inputClass}
                          value={editing.compare_at_price || ''}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              compare_at_price: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                        />
                      </label>
                      <label>
                        <FieldLabel>Stock</FieldLabel>
                        <input
                          type="number"
                          className={inputClass}
                          value={editing.stock ?? 1}
                          onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <FieldLabel>Category</FieldLabel>

                        <select
                          className={inputClass}
                          value={
                            CATS.some((category) => category.value === editing.category)
                              ? editing.category
                              : editing.category
                                ? '__custom__'
                                : 'clutch'
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === '__custom__') {
                              setEditing({ ...editing, category: '' });
                              return;
                            }

                            setEditing({ ...editing, category: value });
                          }}
                        >
                          {CATS.map((category) => (
                            <option className="text-black" key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}

                          <option className="text-black" value="__custom__">
                            Custom category...
                          </option>
                        </select>

                        {!CATS.some((category) => category.value === editing.category) && (
                          <input
                            className={`${inputClass} mt-3`}
                            value={editing.category || ''}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                category: e.target.value.toLowerCase(),
                              })
                            }
                            placeholder="Type a new category, e.g. beach bags"
                          />
                        )}

                        <p className="mt-2 text-xs leading-5 text-neutral-400">
                          Select an existing category or choose custom to type a new one manually.
                        </p>
                      </label>
                      <div>
                        <FieldLabel>Colours visible on site</FieldLabel>
                        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {COLOR_OPTIONS.map((color) => {
                            const selected = normalizeColors(editing.colors).includes(color.value);
                            return (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => toggleColor(color.value)}
                                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                                  selected
                                    ? 'border-neutral-950 bg-neutral-950 text-white'
                                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                                }`}
                              >
                                <span
                                  className="h-4 w-4 rounded-full border border-black/10"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {color.label}
                              </button>
                            );
                          })}
                        </div>
                        <input
                          className={inputClass}
                          placeholder="Custom colours: #f3b8c1, purple, white"
                          value={normalizeColors(editing.colors).join(', ')}
                          onChange={(e) =>
                            updateColors(
                              e.target.value
                                .split(',')
                                .map((x) => x.trim())
                                .filter(Boolean)
                            )
                          }
                        />
                        <p className="mt-2 text-xs leading-5 text-neutral-400">
                          Only these selected colours are shown as dots on the shop and product page.
                        </p>
                      </div>
                    </div>

                    <label>
                      <FieldLabel>Material</FieldLabel>
                      <input
                        className={inputClass}
                        value={editing.material || ''}
                        onChange={(e) => setEditing({ ...editing, material: e.target.value })}
                      />
                    </label>

                    <label>
                      <FieldLabel>Dimensions</FieldLabel>
                      <input
                        className={inputClass}
                        value={editing.dimensions || ''}
                        onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })}
                      />
                    </label>

                    <label>
                      <FieldLabel>Care instructions</FieldLabel>
                      <textarea
                        rows={3}
                        className={inputClass}
                        value={editing.care || ''}
                        onChange={(e) => setEditing({ ...editing, care: e.target.value })}
                      />
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={!!editing.featured}
                        onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                        className="h-4 w-4 accent-neutral-950"
                      />
                      Featured on homepage
                    </label>

                    <button
                      onClick={save}
                      disabled={saving}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c3a368] px-5 py-4 text-xs font-bold uppercase tracking-[.18em] text-neutral-950 transition hover:bg-[#b59455] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save product
                    </button>
                  </div>
                </section>

                <aside className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-950">Images</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Uploads are saved immediately. The first image is the cover.
                      </p>
                    </div>
                    <ImageIcon size={20} className="mt-1 text-neutral-400" />
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {normalizeImages(editing.images).map((img, index, images) => (
                      <div key={`${img}-${index}`} className="admin-image-card !border-neutral-200 !bg-neutral-50">
                        <img src={img} className="h-full w-full object-cover" alt={`Product image ${index + 1}`} />

                        <div className="admin-image-topbar">
                          {index === 0 ? (
                            <span className="admin-image-badge admin-image-badge-cover">
                              <Star size={12} /> Cover
                            </span>
                          ) : (
                            <button type="button" onClick={() => setImageAsCover(index)} className="admin-image-badge">
                              Set as cover
                            </button>
                          )}

                          <button onClick={() => removeImage(img)} className="admin-image-icon-btn" aria-label="Remove image">
                            <X size={14} />
                          </button>
                        </div>

                        <div className="admin-image-toolbar">
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            className="admin-image-order-btn"
                          >
                            <ArrowLeft size={13} />
                          </button>
                          <span className="admin-image-order-label">
                            {index + 1} / {images.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === images.length - 1}
                            className="admin-image-order-btn"
                          >
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!normalizeImages(editing.images).length ? (
                    <div className="mb-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                      No images yet. Upload the cover image first.
                    </div>
                  ) : null}

                  <input ref={fileRef} type="file" hidden accept="image/*" onChange={upload} disabled={!editing?.id || uploading} />

                  {!editing?.id ? (
                    <p className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                      Save the product first, then upload images. This guarantees that the image is saved to the correct product.
                    </p>
                  ) : null}

                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={!editing?.id || uploading || !adminKey}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white py-3 text-xs font-bold uppercase tracking-[.16em] text-neutral-950 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />} Upload image
                  </button>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
