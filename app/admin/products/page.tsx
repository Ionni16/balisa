"use client";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "../AdminContext";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { Plus, Pencil, Trash2, X, Upload, Star, StarOff, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const EMPTY: Partial<Product> = {
  name: "",
  description: "",
  price: 0,
  images: [],
  colors: [],
  category: "tote",
  stock: 0,
  featured: false,
};

const CATEGORIES = ["tote", "mini", "clutch", "crossbody", "shoulder"];

export default function AdminProducts() {
  const { adminKey } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colorInput, setColorInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { "x-admin-key": adminKey, "Content-Type": "application/json" };

  async function loadProducts() {
    const r = await fetch("/api/products", { headers: { "x-admin-key": adminKey } });
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, [adminKey]);

  function openCreate() {
    setEditing(EMPTY);
    setColorInput("");
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing({ ...p });
    setColorInput("");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!editing.name || !editing.price) {
      toast.error("Nome e prezzo sono obbligatori");
      return;
    }
    setSaving(true);
    try {
      const method = editing.id ? "PATCH" : "POST";
      const res = await fetch("/api/products", {
        method,
        headers,
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editing.id ? "Prodotto aggiornato ✨" : "Prodotto creato ✨");
      setModalOpen(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare questo prodotto?")) return;
    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      toast.success("Prodotto eliminato");
      loadProducts();
    } else {
      toast.error("Errore nell'eliminazione");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setEditing((prev) => ({
          ...prev,
          images: [...(prev.images || []), data.url],
        }));
        toast.success("Immagine caricata");
      } else {
        toast.error(data.error || "Errore caricamento");
      }
    } catch {
      toast.error("Errore caricamento");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setEditing((prev) => ({
      ...prev,
      images: (prev.images || []).filter((i) => i !== url),
    }));
  }

  function addColor() {
    const c = colorInput.trim();
    if (!c) return;
    setEditing((prev) => ({
      ...prev,
      colors: [...new Set([...(prev.colors || []), c])],
    }));
    setColorInput("");
  }

  function removeColor(c: string) {
    setEditing((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((x) => x !== c),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-light">Prodotti</h1>
          <p className="font-sans text-sm text-white/40 mt-1">{products.length} prodotti totali</p>
        </div>
        <button onClick={openCreate} className="bg-gold text-noir px-5 py-2.5 font-sans text-sm tracking-wider uppercase flex items-center gap-2 hover:bg-gold/90 transition-colors">
          <Plus size={16} /> Nuovo prodotto
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white/5 border border-white/10 overflow-hidden group">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-white/5">
              {p.images[0] ? (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white/20 font-serif text-4xl">B</div>
              )}
              {p.featured && (
                <div className="absolute top-2 left-2 bg-gold text-noir px-2 py-0.5 font-sans text-[10px] uppercase tracking-wider">
                  Bestseller
                </div>
              )}
              {p.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="font-sans text-xs text-white/70 uppercase tracking-widest">Esaurito</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-lg font-light leading-tight">{p.name}</h3>
                <span className="font-sans text-sm text-gold ml-2 flex-shrink-0">{formatPrice(p.price)}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-xs text-white/30 uppercase tracking-wider">{p.category}</span>
                <span className={`font-sans text-xs ${p.stock > 2 ? "text-green-400" : p.stock > 0 ? "text-yellow-400" : "text-red-400"}`}>
                  Stock: {p.stock}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-2 font-sans text-xs uppercase tracking-wider transition-colors"
                >
                  <Pencil size={12} /> Modifica
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-end">
          <div className="w-full max-w-lg bg-[#1a1a1a] border-l border-white/10 h-screen overflow-y-auto flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1a1a1a] z-10">
              <h2 className="font-serif text-xl font-light">
                {editing.id ? "Modifica prodotto" : "Nuovo prodotto"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Name */}
              <div>
                <label className="admin-label">Nome *</label>
                <input
                  className="admin-input"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="es. Blue Fringe Bag"
                />
              </div>

              {/* Description */}
              <div>
                <label className="admin-label">Descrizione *</label>
                <textarea
                  className="admin-input resize-none"
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Descrivi la borsa..."
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Prezzo (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="admin-input"
                    value={editing.price || ""}
                    onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })}
                    placeholder="89.00"
                  />
                </div>
                <div>
                  <label className="admin-label">Stock *</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editing.stock ?? ""}
                    onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) })}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="admin-label">Categoria *</label>
                <select
                  className="admin-input"
                  value={editing.category || "tote"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a1a]">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing({ ...editing, featured: !editing.featured })}
                  className={`flex items-center gap-2 px-4 py-2 font-sans text-xs uppercase tracking-wider border transition-colors ${
                    editing.featured
                      ? "border-gold text-gold bg-gold/10"
                      : "border-white/20 text-white/40 hover:border-white/40"
                  }`}
                >
                  {editing.featured ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}
                  {editing.featured ? "Bestseller" : "Non in evidenza"}
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className="admin-label">Colori disponibili</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {(editing.colors || []).map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 bg-white/10 px-3 py-1 font-sans text-xs"
                    >
                      {c}
                      <button onClick={() => removeColor(c)} className="text-white/30 hover:text-white">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="admin-input flex-1"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                    placeholder="es. Rosa fucsia"
                  />
                  <button onClick={addColor} className="bg-white/10 hover:bg-white/20 px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors">
                    + Aggiungi
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="admin-label">Immagini</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(editing.images || []).map((img) => (
                    <div key={img} className="relative aspect-square bg-white/10">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-0.5 hover:bg-red-600 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full border border-dashed border-white/20 hover:border-white/40 py-4 font-sans text-xs text-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><Loader2 size={14} className="animate-spin" /> Caricamento...</>
                  ) : (
                    <><Upload size={14} /> Carica immagine</>
                  )}
                </button>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-white/10 flex gap-3 sticky bottom-0 bg-[#1a1a1a]">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 border border-white/20 py-3 font-sans text-sm uppercase tracking-wider hover:border-white/40 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gold text-noir py-3 font-sans text-sm uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {saving ? "Salvataggio..." : editing.id ? "Aggiorna" : "Crea prodotto"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-label {
          display: block;
          font-family: var(--font-dm-sans);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.5rem;
        }
        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          padding: 0.625rem 0.875rem;
          font-family: var(--font-dm-sans);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: #C9A96E;
        }
        .admin-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
