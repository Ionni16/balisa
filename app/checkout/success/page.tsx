"use client";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <CheckCircle size={64} strokeWidth={1} className="text-sage" />
        </div>
        <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-4">
          Ordine confermato
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl font-light mb-6">
          Grazie mille! 🤍
        </h1>
        <p className="font-sans text-sm text-noir/60 leading-relaxed mb-10">
          Il tuo ordine è stato ricevuto. Riceverai una email di conferma a breve.
          La tua borsa verrà realizzata e spedita entro 3–5 giorni lavorativi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            Continua a fare shopping <ArrowRight size={14} />
          </Link>
          <a
            href="https://instagram.com/yourbalisa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            Seguici su Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
