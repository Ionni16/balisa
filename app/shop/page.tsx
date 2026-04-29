import {supabase} from '@/lib/supabase';
import {Product} from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import {getSiteSettings} from '@/lib/settings';

export const dynamic='force-dynamic';
const categories=[['','All'],['mini','Mini'],['shoulder','Shoulder'],['crossbody','Crossbody'],['beach','Beach bags'],['tote','Totes'],['clutch','Clutches'],['custom','Custom']] as const;

async function getProducts(category?:string, search?:string):Promise<Product[]>{
  if(!supabase)return[];
  let q=supabase.from('products').select('*').order('created_at',{ascending:false});
  if(category)q=q.eq('category',category);
  if(search)q=q.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
  const{data}=await q;
  return(data as Product[])||[];
}

export default async function ShopPage({searchParams}:{searchParams:{category?:string;search?:string}}){
  const[settings,products]=await Promise.all([getSiteSettings(),getProducts(searchParams.category,searchParams.search)]);
  const active=searchParams.category||'';
  return <main className="pt-[124px]">
    <section className="site-shell py-10">
      <h1 className="text-[22px] font-normal">{searchParams.search?`Search: ${searchParams.search}`:settings.best_sellers_title}</h1>
    </section>
    <div className="border-y border-black/10 bg-white sticky top-[124px] z-30">
      <div className="site-shell py-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map(([value,label])=><a key={value||'all'} href={value?`/shop?category=${value}`:'/shop'} className={`px-5 py-3 border text-xs tracking-[.08em] whitespace-nowrap transition-colors ${active===value?'bg-black text-white border-black':'border-black/10 hover:border-black bg-white'}`}>{label}</a>)}
      </div>
    </div>
    <section className="site-shell py-10 lg:py-12">
      {products.length?<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-11">{products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="py-24 text-center product-bg"><h2 className="text-4xl font-light">No products available</h2><p className="mt-3 text-black/55">Try another search or category.</p><a href="/shop" className="btn-outline-keylon mt-8">View all</a></div>}
    </section>
  </main>
}
