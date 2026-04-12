import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Product) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | BALISA`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-4">
        <nav className="font-sans text-[10px] tracking-wider uppercase text-noir/35">
          <Link href="/" className="hover:text-noir transition-colors">Home</Link>
          <span className="mx-2">·</span>
          <Link href="/shop" className="hover:text-noir transition-colors">Shop</Link>
          <span className="mx-2">·</span>
          <span className="text-noir/60">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Images */}
          <div className="space-y-3 lg:space-y-4">
            {product.images.length > 0 ? (
              product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-cream-dark overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${product.name} - immagine ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-cream-dark flex items-center justify-center">
                <span className="font-serif text-6xl text-noir/10">B</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/35 mb-3">
              BALISA ✦ {product.category}
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-light leading-tight mb-3">
              {product.name}
            </h1>
            <p className="font-serif text-2xl lg:text-3xl font-light text-gold mb-6 lg:mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="w-10 h-px bg-noir/15 mb-6 lg:mb-8" />

            <p className="font-sans text-sm text-noir/60 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details box */}
            <div className="bg-cream-dark p-5 lg:p-6 space-y-3 mb-8">
              <div className="flex justify-between">
                <span className="font-sans text-[10px] text-noir/35 uppercase tracking-wider">
                  Colori
                </span>
                <span className="font-sans text-xs text-noir/70">
                  {product.colors.join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[10px] text-noir/35 uppercase tracking-wider">
                  Disponibilità
                </span>
                <span className={`font-sans text-xs ${product.stock > 0 ? "text-sage" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} disponibili` : "Esaurito"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[10px] text-noir/35 uppercase tracking-wider">
                  Spedizione
                </span>
                <span className="font-sans text-xs text-noir/70">
                  3–5 giorni lavorativi
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[10px] text-noir/35 uppercase tracking-wider">
                  Materiale
                </span>
                <span className="font-sans text-xs text-noir/70">
                  Filato di qualità, lavorato a mano
                </span>
              </div>
            </div>

            {/* Actions */}
            <ProductActions product={product} />

            {/* Trust badges */}
            <div className="mt-8 pt-8 border-t border-cream-dark grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "🤲", text: "Fatto a mano" },
                { icon: "📦", text: "Spedizione sicura" },
                { icon: "💬", text: "Scrivici per info" },
              ].map((b) => (
                <div key={b.text}>
                  <p className="text-xl mb-1">{b.icon}</p>
                  <p className="font-sans text-[9px] text-noir/40 uppercase tracking-wider leading-tight">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
