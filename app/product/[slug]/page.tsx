import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions";
import Image from "next/image";
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
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Images */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-cream-dark overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.name} - immagine ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-cream-dark flex items-center justify-center">
                <span className="font-serif text-6xl text-noir/20">B</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28">
            <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-3">
              BALISA ✦ {product.category}
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-light leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-serif text-3xl font-light text-gold mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="w-12 h-px bg-noir/20 mb-8" />

            <p className="font-sans text-sm text-noir/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details list */}
            <div className="bg-cream-dark p-6 space-y-3 mb-8">
              <div className="flex justify-between">
                <span className="font-sans text-xs text-noir/40 uppercase tracking-wider">
                  Colori disponibili
                </span>
                <span className="font-sans text-xs text-noir">
                  {product.colors.join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-xs text-noir/40 uppercase tracking-wider">
                  Disponibilità
                </span>
                <span className={`font-sans text-xs ${product.stock > 0 ? "text-sage" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} disponibili` : "Esaurito"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-xs text-noir/40 uppercase tracking-wider">
                  Spedizione
                </span>
                <span className="font-sans text-xs text-noir">
                  3–5 giorni lavorativi
                </span>
              </div>
            </div>

            {/* Add to cart — client component */}
            <ProductActions product={product} />

            {/* Trust badges */}
            <div className="mt-8 pt-8 border-t border-cream-dark grid grid-cols-3 gap-4 text-center">
              {[
                { emoji: "🤲", text: "Fatto a mano" },
                { emoji: "📦", text: "Spedizione sicura" },
                { emoji: "💬", text: "DM per info" },
              ].map((b) => (
                <div key={b.text}>
                  <p className="text-2xl mb-1">{b.emoji}</p>
                  <p className="font-sans text-xs text-noir/50 uppercase tracking-wider">
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
