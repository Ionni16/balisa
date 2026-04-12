"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeft, Loader2, Lock } from "lucide-react";

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
      <div className="min-h-screen pt-20 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Il carrello è vuoto
          </p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 mt-2">
            <ArrowLeft size={14} /> Torna allo shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="max-w-5xl mx-auto px-5 lg:px-12 py-10 lg:py-14">
        {/* Back link */}
        <Link
          href="/shop"
          className="font-sans text-[10px] tracking-wider uppercase text-noir/35 hover:text-noir transition-colors inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft size={10} /> Continua lo shopping
        </Link>

        <h1 className="font-serif text-3xl lg:text-4xl font-light mb-10 lg:mb-14">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Informazioni personali
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Nome completo *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="mario@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Indirizzo di spedizione
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Via e numero civico *
                  </label>
                  <input
                    name="line1"
                    value={form.line1}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Via Roma 1"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Città *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Milano"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    CAP *
                  </label>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="20100"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Lock size={12} className="text-noir/30" />
              <p className="font-sans text-[11px] text-noir/35">
                Pagamento sicuro tramite Stripe. Non salviamo i dati della carta.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Riepilogo ordine
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.color}`} className="flex gap-3">
                    <div className="relative w-14 h-[68px] bg-cream-dark flex-shrink-0">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-light truncate">
                        {item.product.name}
                      </p>
                      <p className="font-sans text-[10px] text-noir/35">
                        {item.color} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-sans text-sm flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-dark pt-5 space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-sans text-xs text-noir/50">Subtotale</span>
                  <span className="font-sans text-sm">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-xs text-noir/50">Spedizione</span>
                  <span className="font-sans text-xs text-sage">
                    Calcolata da Stripe
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-cream-dark">
                  <span className="font-serif text-lg font-light">Totale</span>
                  <span className="font-serif text-lg font-light">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Elaborazione...
                  </>
                ) : (
                  <>
                    Paga ora <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
