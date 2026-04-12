"use client";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  useEffect(() => { clearCart(); }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center">
            <CheckCircle size={32} strokeWidth={1} className="text-sage" />
          </div>
        </div>
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-noir/35 mb-3">
          Ordine confermato
        </p>
        <h1 className="font-serif text-3xl lg:text-4xl font-light mb-5">
          Grazie mille!
        </h1>
        <p className="font-sans text-sm text-noir/50 leading-relaxed mb-8">
          Il tuo ordine è stato ricevuto. Riceverai una email di conferma a breve.
          La tua borsa verrà realizzata e spedita entro 3–5 giorni lavorativi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
            Continua lo shopping <ArrowRight size={14} />
          </Link>
          <a
            href="https://instagram.com/yourbalisa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            Seguici su Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
