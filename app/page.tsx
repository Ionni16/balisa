import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
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
      <section className="relative min-h-[100svh] flex items-center overflow-hidden" style={{ background: "#FDF9D0" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] right-[8%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-[#C9A96E]/8 blur-[80px]" />
          <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] max-w-[350px] rounded-full bg-[#E8C4C0]/15 blur-[60px]" />
          {/* Fine grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-12 w-full py-32 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p
                className="font-sans text-[10px] lg:text-xs tracking-[0.4em] uppercase text-noir/35 mb-6 lg:mb-8 animate-fade-up"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}
              >
                Handmade in Italy ✦ Pezzo Unico
              </p>
              <h1
                className="font-serif text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.92] text-noir mb-8 lg:mb-10 animate-fade-up"
                style={{ animationDelay: "400ms", animationFillMode: "both" }}
              >
                From our<br />
                <em className="italic" style={{ color: "#C9A96E" }}>hands</em><br />
                to yours
              </h1>
              <div
                className="flex flex-col sm:flex-row gap-3 animate-fade-up"
                style={{ animationDelay: "600ms", animationFillMode: "both" }}
              >
                <Link href="/shop" className="btn-primary inline-flex items-center justify-center gap-3">
                  Scopri la collezione
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="https://instagram.com/yourbalisa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2"
                >
                  @yourbalisa
                </a>
              </div>
            </div>

            {/* Logo / Visual */}
            <div
              className="hidden lg:flex items-center justify-center animate-fade-up"
              style={{ animationDelay: "500ms", animationFillMode: "both" }}
            >
              <div className="relative">
                <div className="w-[380px] h-[380px] rounded-full border border-noir/5 flex items-center justify-center">
                  <div className="w-[300px] h-[300px] rounded-full border border-noir/5 flex items-center justify-center">
                    <Image
                      src="/logo_balisa.jpeg"
                      alt="Balisa Logo"
                      width={200}
                      height={80}
                      className="w-44 h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute top-0 right-8 w-2 h-2 rounded-full bg-gold/40" />
                <div className="absolute bottom-12 left-0 w-1.5 h-1.5 rounded-full bg-blush/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: "1s", animationFillMode: "both" }}>
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-noir/25">Scroll</span>
          <div className="w-px h-8 bg-noir/15" />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-noir text-cream py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10)
            .fill("✦ HANDMADE ✦ FATTO A MANO ✦ PEZZO UNICO ✦ BALISA ")
            .map((t, i) => (
              <span key={i} className="font-sans text-[10px] tracking-[0.3em] uppercase inline-block">
                {t}
              </span>
            ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 lg:px-12 py-20 lg:py-28">
          <div className="flex items-end justify-between mb-10 lg:mb-14">
            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/35 mb-2">
                Le più amate
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light">Bestseller</h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] uppercase text-noir/50 hover:text-noir hover:gap-3 transition-all"
            >
              Vedi tutte <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/shop" className="btn-outline inline-flex items-center gap-2 text-xs px-6 py-3">
              Vedi tutte <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="bg-cream-dark py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/35 mb-3">
                Chi siamo
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight mb-6 lg:mb-8">
                Ogni borsa<br />racconta una<br />
                <em className="italic text-gold">storia</em>
              </h2>
              <div className="space-y-4 font-sans text-sm text-noir/60 leading-relaxed max-w-md">
                <p>
                  BALISA nasce dalla passione per l&apos;artigianato e la cura dei dettagli.
                  Ogni borsa è realizzata interamente a mano, con filati di qualità selezionati
                  con attenzione.
                </p>
                <p>
                  Non esistono due pezzi identici — ogni bag è unica, come chi la porta.
                </p>
              </div>
              <div className="flex gap-10 lg:gap-12 mt-10">
                <div>
                  <p className="font-serif text-3xl lg:text-4xl font-light text-gold">100%</p>
                  <p className="font-sans text-[10px] tracking-wider uppercase text-noir/40 mt-1">
                    Fatto a mano
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl lg:text-4xl font-light text-gold">✦</p>
                  <p className="font-sans text-[10px] tracking-wider uppercase text-noir/40 mt-1">
                    Pezzo unico
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl lg:text-4xl font-light text-gold">♡</p>
                  <p className="font-sans text-[10px] tracking-wider uppercase text-noir/40 mt-1">
                    Con amore
                  </p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative flex items-center justify-center">
              <div className="aspect-square w-full max-w-md bg-[#FDF9D0] rounded-full flex items-center justify-center relative">
                <Image
                  src="/logo_balisa.jpeg"
                  alt="Balisa"
                  width={180}
                  height={72}
                  className="w-40 lg:w-48 h-auto object-contain"
                />
              </div>
              <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 bg-noir text-cream p-6 lg:p-7 max-w-[180px]">
                <p className="font-serif text-lg lg:text-xl font-light italic leading-snug">
                  &ldquo;From our hands to yours&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-5 lg:px-12 text-center">
        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/35 mb-4">
          Seguici
        </p>
        <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light mb-6">
          Trovaci su Instagram
        </h2>
        <p className="font-sans text-sm text-noir/50 mb-8 max-w-md mx-auto">
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
