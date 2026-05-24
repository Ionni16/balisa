"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/stripe";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeft, Loader2, Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const shippingCountries = [
  { code: "IT", name: "Italy" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "NL", name: "Netherlands" },
  { code: "LU", name: "Luxembourg" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "DK", name: "Denmark" },
  { code: "SE", name: "Sweden" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "GR", name: "Greece" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "CH", name: "Switzerland" },
  { code: "NO", name: "Norway" },
];

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
    country: "IT",
  });

  const isItaly = form.country === "IT";
  const shippingAmount = isItaly ? (cartTotal >= 79 ? 0 : 4.99) : 11.99;
  const finalTotal = cartTotal + shippingAmount;

  const shippingLabel = isItaly
    ? shippingAmount === 0
      ? "Free shipping"
      : "Italy"
    : "Europe";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.line1 ||
      !form.city ||
      !form.postal_code ||
      !form.country
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
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

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      toast.error(err.message || "Checkout error");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Your cart is empty
          </p>

          <Link
            href="/shop"
            className="btn-primary inline-flex items-center gap-2 mt-2"
          >
            <ArrowLeft size={14} />
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="max-w-5xl mx-auto px-5 lg:px-12 py-10 lg:py-14">
        <Link
          href="/shop"
          className="font-sans text-[10px] tracking-wider uppercase text-noir/35 hover:text-noir transition-colors inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft size={10} />
          Continue shopping
        </Link>

        <h1 className="font-serif text-3xl lg:text-4xl font-light mb-10 lg:mb-14">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Personal information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Full name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Jane Smith"
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
                    placeholder="jane@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Shipping address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {shippingCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Street address *
                  </label>
                  <input
                    name="line1"
                    value={form.line1}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Street name and number"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    City *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Milan"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-wider uppercase text-noir/40 block mb-2">
                    Postal code *
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
                Secure payment via Stripe. We do not store your card details.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-5">
                Order summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-16 h-20 bg-cream-dark flex-shrink-0 overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wider text-black/30">
                          No image
                        </div>
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
                  <span className="font-sans text-xs text-noir/50">
                    Subtotal
                  </span>
                  <span className="font-sans text-sm">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-xs text-noir/50">
                    Shipping {shippingLabel}
                  </span>
                  <span className="font-sans text-sm">
                    {shippingAmount === 0 ? "Free" : formatPrice(shippingAmount)}
                  </span>
                </div>

                {isItaly && cartTotal < 79 && (
                  <p className="font-sans text-[11px] text-noir/35">
                    Free shipping in Italy on orders over €79.
                  </p>
                )}

                {isItaly && cartTotal >= 79 && (
                  <p className="font-sans text-[11px] text-noir/35">
                    Your order qualifies for free shipping in Italy.
                  </p>
                )}

                {!isItaly && (
                  <p className="font-sans text-[11px] text-noir/35">
                    Europe shipping: €11.99. Free shipping applies to Italy only.
                  </p>
                )}

                <div className="flex justify-between pt-3 border-t border-cream-dark">
                  <span className="font-serif text-lg font-light">Total</span>
                  <span className="font-serif text-lg font-light">
                    {formatPrice(finalTotal)}
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
                    <Loader2 size={15} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay now <ArrowRight size={13} />
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