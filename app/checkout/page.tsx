"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/stripe";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { ArrowRight, Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const cartTotal = total();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    line1: "",
    city: "",
    postal_code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.line1 || !form.city || !form.postal_code) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    if (items.length === 0) {
      toast.error("Il carrello è vuoto");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });

      const { sessionId, error } = await res.json();
      if (error) throw new Error(error);

      const stripe = await stripePromise;
      await stripe!.redirectToCheckout({ sessionId });
    } catch (err: any) {
      toast.error(err.message || "Errore al checkout");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl font-light mb-4">Il carrello è vuoto</p>
          <a href="/shop" className="btn-primary inline-block">Torna allo shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14">
        <h1 className="font-serif text-4xl font-light mb-14">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-6">
                Informazioni
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-xs tracking-wider uppercase text-noir/50 block mb-2">
                    Nome completo *
                  </label>
                  <input name="name" value={form.name} onChange={handleChange} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-sans text-xs tracking-wider uppercase text-noir/50 block mb-2">
                    Email *
                  </label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-6">
                Indirizzo di spedizione
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-xs tracking-wider uppercase text-noir/50 block mb-2">
                    Via *
                  </label>
                  <input name="line1" value={form.line1} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-noir/50 block mb-2">
                    Città *
                  </label>
                  <input name="city" value={form.city} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-noir/50 block mb-2">
                    CAP *
                  </label>
                  <input name="postal_code" value={form.postal_code} onChange={handleChange} className="input-field" />
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-noir/40">
              Il pagamento avverrà in modo sicuro tramite Stripe. Non salviamo i dati della carta.
            </p>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <h2 className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-6">
              Riepilogo ordine
            </h2>

            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.color}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-cream-dark flex-shrink-0">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-base font-light">{item.product.name}</p>
                    <p className="font-sans text-xs text-noir/40">{item.color} × {item.quantity}</p>
                  </div>
                  <p className="font-sans text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-dark pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-noir/60">Subtotale</span>
                <span className="font-sans text-sm">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-noir/60">Spedizione</span>
                <span className="font-sans text-sm text-sage">Calcolata da Stripe</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream-dark">
                <span className="font-serif text-xl font-light">Totale</span>
                <span className="font-serif text-xl font-light">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full mt-8 flex items-center justify-center gap-3"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Elaborazione...</>
              ) : (
                <>Paga ora <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
