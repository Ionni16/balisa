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

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data as Product[]) || [];
}

export default async function ShopPage({ searchParams }: Props) {
  const { category } = searchParams;
  const products = await getProducts(category);

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 border-b border-cream-dark">
        <p className="font-sans text-xs tracking-widest uppercase text-noir/40 mb-3">
          Collezione
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light">
          {category
            ? categories.find((c) => c.value === category)?.label || "Shop"
            : "Tutte le borse"}
        </h1>
      </div>

      {/* Filter pills */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex gap-3 flex-wrap border-b border-cream-dark">
        {categories.map((c) => (
          <a
            key={c.value}
            href={c.value ? `/shop?category=${c.value}` : "/shop"}
            className={`font-sans text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
              (category || "") === c.value
                ? "bg-noir text-cream border-noir"
                : "border-cream-dark text-noir/60 hover:border-noir hover:text-noir"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-3xl font-light text-noir/30">
              Nessun prodotto disponibile
            </p>
          </div>
        ) : (
          <>
            <p className="font-sans text-xs text-noir/40 mb-10">
              {products.length} {products.length === 1 ? "prodotto" : "prodotti"}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
