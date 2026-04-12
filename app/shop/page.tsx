import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface Props {
  searchParams: { category?: string };
}

const categories = [
  { value: "", label: "Tutte" },
  { value: "tote", label: "Tote" },
  { value: "mini", label: "Mini" },
  { value: "clutch", label: "Clutch" },
  { value: "crossbody", label: "Crossbody" },
  { value: "shoulder", label: "Shoulder" },
];

async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data } = await query;
  return (data as Product[]) || [];
}

export default async function ShopPage({ searchParams }: Props) {
  const { category } = searchParams;
  const products = await getProducts(category);

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-10 lg:py-14 border-b border-cream-dark">
        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/35 mb-2">
          Collezione
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light">
          {category
            ? categories.find((c) => c.value === category)?.label || "Shop"
            : "Tutte le borse"}
        </h1>
      </div>

      {/* Filter pills - scrollable on mobile */}
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-4 lg:py-6 border-b border-cream-dark overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 lg:gap-3 min-w-max">
          {categories.map((c) => (
            <a
              key={c.value}
              href={c.value ? `/shop?category=${c.value}` : "/shop"}
              className={`font-sans text-[10px] lg:text-xs tracking-[0.15em] uppercase px-3.5 lg:px-4 py-2 border transition-all whitespace-nowrap ${
                (category || "") === c.value
                  ? "bg-noir text-cream border-noir"
                  : "border-cream-dark text-noir/50 hover:border-noir hover:text-noir"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-10 lg:py-14">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl lg:text-3xl font-light text-noir/25">
              Nessun prodotto disponibile
            </p>
            <a href="/shop" className="btn-outline inline-block mt-6 text-xs px-6 py-3">
              Vedi tutti i prodotti
            </a>
          </div>
        ) : (
          <>
            <p className="font-sans text-[10px] text-noir/35 mb-8 lg:mb-10 tracking-wider uppercase">
              {products.length} {products.length === 1 ? "prodotto" : "prodotti"}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-7">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
