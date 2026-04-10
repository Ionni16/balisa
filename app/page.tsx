import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(4);
  return (data as Product[]) || [];
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden bg-cream">
        {/* Background decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-[45vw] h-[45vw] max-w-xl max-h-xl rounded-full bg-blush/30 blur-3xl" />
          <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] max-w-md rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl">
            <p
              className="font-sans text-xs tracking-[0.4em] uppercase text-noir/40 mb-8 animate-fade-up"
              style={{ animationDelay: "200ms", animationFillMode: "both", opacity: 0 }}
            >
              Handmade in Italy ✦ Pezzo Unico
            </p>
            <h1
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] text-noir mb-10 animate-fade-up"
              style={{ animationDelay: "400ms", animationFillMode: "both", opacity: 0 }}
            >
              From our<br />
              <em className="italic text-gold">hands</em><br />
              to yours
            </h1>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: "600ms", animationFillMode: "both", opacity: 0 }}
            >
              <Link href="/shop" className="btn-primary inline-flex items-center gap-3">
                Scopri la collezione
                <ArrowRight size={14} />
              </Link>
              <a
                href="https://instagram.com/yourbalisa"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                @yourbalisa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-noir text-cream py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(8).fill("✦ HANDMADE ✦ FATTO A MANO ✦ PEZZO UNICO ✦ BALISA ").map((t, i) => (
            <span
              key={i}
              className="font-sans text-xs tracking-[0.3em] uppercase mr-0 inline-block"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-28">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-3">
                Le più amate
              </p>
              <h2 className="font-serif text-5xl font-light">
                Bestseller
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase hover:gap-4 transition-all"
            >
              Vedi tutte <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link href="/shop" className="btn-outline inline-flex items-center gap-2">
              Vedi tutte <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="bg-cream-dark py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-4">
                Chi siamo
              </p>
              <h2 className="font-serif text-5xl font-light leading-tight mb-8">
                Ogni borsa<br />racconta una<br />
                <em className="italic text-gold">storia</em>
              </h2>
              <div className="space-y-4 font-sans text-sm text-noir/70 leading-relaxed max-w-md">
                <p>
                  BALISA nasce dalla passione per l'artigianato e la cura dei dettagli.
                  Ogni borsa è realizzata interamente a mano, con filati di qualità selezionati
                  con attenzione.
                </p>
                <p>
                  Non esistono due pezzi identici — ogni bag è unica, come chi la porta.
                  Questo è il nostro regalo a te.
                </p>
              </div>
              <div className="flex gap-12 mt-12">
                <div>
                  <p className="font-serif text-4xl font-light text-gold">100%</p>
                  <p className="font-sans text-xs tracking-wider uppercase text-noir/50 mt-1">
                    Fatto a mano
                  </p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-light text-gold">✦</p>
                  <p className="font-sans text-xs tracking-wider uppercase text-noir/50 mt-1">
                    Pezzo unico
                  </p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-light text-gold">🤍</p>
                  <p className="font-sans text-xs tracking-wider uppercase text-noir/50 mt-1">
                    Con amore
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative block */}
            <div className="relative">
              <div className="aspect-square bg-blush/40 rounded-full max-w-md mx-auto flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-8xl font-light text-noir/20">B</p>
                </div>
              </div>
              <div className="absolute bottom-8 right-8 bg-noir text-cream p-8 max-w-[200px]">
                <p className="font-serif text-xl font-light italic leading-snug">
                  "From our hands to yours"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-6">
          Seguici
        </p>
        <h2 className="font-serif text-5xl lg:text-6xl font-light mb-8">
          Trovaci su Instagram
        </h2>
        <p className="font-sans text-sm text-noir/60 mb-10 max-w-md mx-auto">
          Per info, custom orders e dietro le quinte della nostra creazione artigianale.
        </p>
        <a
          href="https://instagram.com/yourbalisa"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-3"
        >
          @yourbalisa <ArrowRight size={14} />
        </a>
      </section>
    </>
  );
}
