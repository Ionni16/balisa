import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultCategories = [
  ['mini', 'Mini'],
  ['shoulder', 'Shoulder'],
  ['crossbody', 'Crossbody'],
  ['beach bags', 'Beach bags'],
  ['clutch', 'Clutches'],
  ['custom', 'Custom'],
] as const;

function formatCategoryLabel(category: string) {
  const known = defaultCategories.find(([value]) => value === category);
  if (known) return known[1];

  return category
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getProducts(category?: string, search?: string): Promise<Product[]> {
  if (!supabase) return [];

  let q = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category === 'beach bags') {
    q = q.in('category', ['beach', 'beach bags']);
  } else if (category) {
    q = q.eq('category', category);
  }

  if (search) {
    q = q.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { data } = await q;
  return (data as Product[]) || [];
}

async function getCategories(): Promise<[string, string][]> {
  if (!supabase) return [['', 'All'], ...defaultCategories];

  const { data } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null);

  const productCategories = Array.from(
    new Set(
      ((data as Pick<Product, 'category'>[]) || [])
        .map((product) => String(product.category || '').trim().toLowerCase())
        .filter(Boolean)
        .filter((category) => category !== 'tote')
        .map((category) => (category === 'beach' ? 'beach bags' : category))
    )
  );

  const merged = Array.from(
    new Set([
      ...defaultCategories.map(([value]) => value),
      ...productCategories,
    ])
  );

  return [
    ['', 'All'],
    ...merged.map((category) => [
      category,
      formatCategoryLabel(category),
    ] as [string, string]),
  ];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [settings, products, categories] = await Promise.all([
    getSiteSettings(),
    getProducts(searchParams.category, searchParams.search),
    getCategories(),
  ]);

  const active = searchParams.category || '';

  return (
    <main className="pt-[124px] md:pt-[102px]">
      <section className="site-shell py-10">
        <h1 className="text-[22px] font-normal">
          {searchParams.search
            ? `Search: ${searchParams.search}`
            : settings.best_sellers_title}
        </h1>
      </section>

      <div className="border-y border-black/10 bg-white sticky top-[124px] z-30">
        <div className="site-shell py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(([value, label]) => (
            <a
              key={value || 'all'}
              href={value ? `/shop?category=${encodeURIComponent(value)}` : '/shop'}
              className={`px-5 py-3 border text-xs tracking-[.08em] whitespace-nowrap transition-colors ${
                active === value
                  ? 'bg-black text-white border-black'
                  : 'border-black/10 hover:border-black bg-white'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <section className="site-shell py-10 lg:py-12">
        {products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-11">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center product-bg">
            <h2 className="text-4xl font-light">No products available</h2>
            <p className="mt-3 text-black/55">
              Try another search or category.
            </p>
            <a href="/shop" className="btn-outline-keylon mt-8">
              View all
            </a>
          </div>
        )}
      </section>
    </main>
  );
}