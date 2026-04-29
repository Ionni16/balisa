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

const CATS = ['clutch', 'beach', 'ibiza', 'tote', 'custom', 'mini', 'shoulder', 'crossbody'];

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
    if (!editing?.name || !editing?.price) {
      return toast.error('Name and price are required');
    }

    setSaving(true);
    const response = await fetch('/api/products', {
      method: editing.id ? 'PATCH' : 'POST',
      headers,
      body: JSON.stringify(editing),
    });
    setSaving(false);

    if (response.ok) {
      toast.success('Product saved');
      setEditing(null);
      load();
    } else {
      toast.error((await response.json()).error || 'Error');
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

    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: productId, images }),
    });

    if (!response.ok) {
      toast.error((await response.json()).error || 'Could not save image gallery');
      return false;
    }

    setItems((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, images } : product
      )
    );
    return true;
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
      body: fd,
    });
    const data = await response.json();
    setUploading(false);

    if (data.url) {
      const nextImages = [data.url, ...((editing.images as string[]) || [])];
      setEditing({ ...editing, images: nextImages });
      const saved = await persistImages(editing.id, nextImages);
      toast.success(saved && editing.id ? 'Image added and saved as cover' : 'Image added as cover image');
    } else {
      toast.error(data.error || 'Upload error');
    }

    if (fileRef.current) fileRef.current.value = '';
  }

  async function setImageAsCover(index: number) {
    if (!editing?.images?.length) return;
    const images = [...(editing.images as string[])];
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  async function moveImage(index: number, direction: -1 | 1) {
    if (!editing?.images?.length) return;
    const images = [...(editing.images as string[])];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  async function removeImage(img: string) {
    if (!editing) return;
    const images = ((editing.images as string[]) || []).filter((x) => x !== img);
    setEditing({ ...editing, images });
    await persistImages(editing.id, images);
  }

  if (loading) {
    return (
      <div className="h-64 grid place-items-center">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-8">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="text-white/40 text-sm mt-2 max-w-2xl">
            Create products, edit stock and manage the product gallery. The first image is used as the cover image on the shop and homepage.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-gold text-ink rounded-2xl px-5 py-3 text-xs uppercase tracking-[.16em] font-bold flex gap-2 items-center justify-center"
        >
          <Plus size={15} /> New product
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((product) => (
          <div key={product.id} className="admin-panel overflow-hidden">
            <div className="aspect-[4/3] bg-white/5">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full grid place-items-center logo-word text-5xl text-white/10">Balisa</div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between gap-4">
                <h3 className="font-serif text-2xl">{product.name}</h3>
                <b className="text-gold">{formatPrice(product.price)}</b>
              </div>
              <p className="text-xs uppercase tracking-[.16em] text-white/35 mt-2">
                {product.category} · stock {product.stock} {product.featured ? '· featured' : ''}
              </p>
              <p className="text-sm text-white/45 mt-3 line-clamp-2">{product.description}</p>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setEditing({ ...product })}
                  className="flex-1 bg-white/10 rounded-xl py-3 text-xs uppercase tracking-[.14em] flex justify-center gap-2 items-center"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => del(product.id)} className="px-4 bg-red-500/10 text-red-300 rounded-xl">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-3 sm:p-4">
          <div className="bg-[#151515] border border-white/10 rounded-[28px] w-full max-w-5xl max-h-[94vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#151515]/95 backdrop-blur border-b border-white/10 p-5 flex justify-between items-center z-10">
              <div>
                <h2 className="font-serif text-3xl">{editing.id ? 'Edit product' : 'New product'}</h2>
                <p className="text-white/35 text-xs mt-1 uppercase tracking-[.14em]">
                  First image = product cover on the site
                </p>
              </div>
              <button onClick={() => setEditing(null)} className="text-white/75 hover:text-white transition-colors">
                <X />
              </button>
            </div>

            <div className="p-4 sm:p-5 lg:p-7 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
              <div className="grid gap-4">
                <label>
                  <span className="admin-label">Name</span>
                  <input className="admin-input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </label>

                <label>
                  <span className="admin-label">Description</span>
                  <textarea
                    rows={5}
                    className="admin-input"
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </label>

                <div className="grid sm:grid-cols-3 gap-4">
                  <label>
                    <span className="admin-label">Price EUR</span>
                    <input
                      type="number"
                      className="admin-input"
                      value={editing.price ?? 0}
                      onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    <span className="admin-label">Compare at</span>
                    <input
                      type="number"
                      className="admin-input"
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
                    <span className="admin-label">Stock</span>
                    <input
                      type="number"
                      className="admin-input"
                      value={editing.stock ?? 1}
                      onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label>
                    <span className="admin-label">Category</span>
                    <select
                      className="admin-input"
                      value={editing.category || 'clutch'}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      {CATS.map((category) => (
                        <option className="text-black" key={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="admin-label">Colours, comma separated</span>
                    <input
                      className="admin-input"
                      value={((editing.colors as string[]) || []).join(', ')}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          colors: e.target.value
                            .split(',')
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  <span className="admin-label">Material</span>
                  <input
                    className="admin-input"
                    value={editing.material || ''}
                    onChange={(e) => setEditing({ ...editing, material: e.target.value })}
                  />
                </label>

                <label>
                  <span className="admin-label">Dimensions</span>
                  <input
                    className="admin-input"
                    value={editing.dimensions || ''}
                    onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })}
                  />
                </label>

                <label className="flex items-center gap-3 text-sm text-white/60">
                  <input
                    type="checkbox"
                    checked={!!editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  />
                  Featured on homepage
                </label>

                <button
                  onClick={save}
                  disabled={saving}
                  className="bg-gold text-ink rounded-2xl px-5 py-4 text-xs uppercase tracking-[.18em] font-bold flex justify-center gap-2 items-center"
                >
                  {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save product
                </button>
              </div>

              <aside>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="admin-label">Images</span>
                    <p className="text-white/35 text-xs leading-5">
                      Uploads appear immediately. The first image is the one shown in the shop, homepage and product cover.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {((editing.images as string[]) || []).map((img, index, images) => (
                    <div key={`${img}-${index}`} className="admin-image-card">
                      <img src={img} className="w-full h-full object-cover" alt={`Product image ${index + 1}`} />

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

                {!((editing.images as string[]) || []).length ? (
                  <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/35 mb-4">
                    No images yet. Upload the cover image first.
                  </div>
                ) : null}

                <input ref={fileRef} type="file" hidden accept="image/*" onChange={upload} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-white/15 rounded-2xl py-3 text-xs uppercase tracking-[.16em] flex justify-center gap-2 items-center hover:bg-white/10"
                >
                  {uploading ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />} Upload image
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
