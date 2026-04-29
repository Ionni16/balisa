import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/stripe';
import { notFound } from 'next/navigation';
import ProductActions from './ProductActions';
import Image from 'next/image';
import type { Metadata } from 'next';

export const dynamic='force-dynamic';

const colorMap:Record<string,string>={navy:'#073763',blue:'#073763',black:'#000',grey:'#5d5d5d',gray:'#5d5d5d',brown:'#6b4b38',burgundy:'#8b2638',red:'#d51f28',beige:'#efe8de',cream:'#efe8de',white:'#f7f3ed',pink:'#f3b8c1',orange:'#ef5b18',yellow:'#f2d13b',green:'#1f6b3a'};
function colourValue(c:string){const k=c.toLowerCase().trim();return colorMap[k]||k;}

async function getProduct(slug:string):Promise<Product|null>{
  if(!supabase)return null;
  const {data}=await supabase.from('products').select('*').eq('slug',slug).single();
  return data as Product||null;
}
async function getRelated(currentId:string):Promise<Product[]>{
  if(!supabase)return[];
  const {data}=await supabase.from('products').select('*').neq('id',currentId).order('created_at',{ascending:false}).limit(3);
  return (data as Product[])||[];
}

export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{
  const p=await getProduct(params.slug);
  if(!p)return{};
  return{title:`${p.name} | Balisa`,description:p.description,openGraph:{title:`${p.name} | Balisa`,description:p.description,images:p.images?.[0]?[p.images[0]]:[]}};
}

export default async function ProductPage({params}:{params:{slug:string}}){
  const product=await getProduct(params.slug);
  if(!product)notFound();
  const related=await getRelated(product.id);
  const colors=(product.colors&&product.colors.length?product.colors:['Blue','Black','Grey','Brown','Burgundy','Red','Beige']).slice(0,7);
  const images=product.images?.length?product.images:[];

  return <main className="pt-[124px]">
    <section className="site-shell py-8 lg:py-10 grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-16 items-start">
      <div>
        <div className="relative aspect-square product-bg overflow-hidden">
          {images[0]?<Image src={images[0]} alt={product.name} fill priority className="object-contain p-3 scale-[1.08]"/>:<div className="h-full grid place-items-center logo-word text-7xl text-black/10">Balisa</div>}
        </div>
        {images.length>1&&<div className="mt-5 grid grid-cols-4 gap-3">
          {images.slice(0,4).map((img,i)=><div key={img} className={`relative aspect-square product-bg overflow-hidden ${i===0?'ring-2 ring-black':''}`}><Image src={img} alt={`${product.name} ${i+1}`} fill className="object-contain p-1 scale-[1.08]"/></div>)}
        </div>}
      </div>

      <aside className="lg:pt-3">
        <h1 className="text-[24px] font-normal mb-6">{product.name}</h1>
        <p className="text-[18px] mb-7">{formatPrice(product.price)} EUR</p>
        <div className="flex gap-3 mb-8">{colors.map((c,i)=><span key={`${c}-${i}`} className="color-dot !w-[24px] !h-[24px]" style={{background:colourValue(c)}} title={c}/>)}</div>
        <div className="text-[15px] leading-8 text-black/68 max-w-[520px] space-y-5">
          <p>{product.description}</p>
          <p>Made from <b>100% cotton</b> and handcrafted just for you. Ready to ship in 1 week.</p>
          {product.dimensions&&<p><b>Size:</b> {product.dimensions}</p>}
          <p><b>Care instructions:</b> {product.care||'Hand wash in cold water with mild soap and lay flat to dry.'}</p>
          <p>Shipping is calculated at check-out.</p>
        </div>
        <ProductActions product={product}/>
        {related.length>0&&<div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[15px]">Add a Bag charm / Keychain</h2>
            <div className="flex gap-6 text-xl"><span>‹</span><span>›</span></div>
          </div>
          <div className="grid gap-3">
            {related.map(r=><a href={`/product/${r.slug}`} key={r.id} className="border border-black/20 min-h-[78px] flex items-center gap-4 px-4 hover:border-black transition-colors">
              <span className="w-4 h-4 border border-black/70 rounded-[3px]"/>
              <span className="relative w-12 h-12 product-bg shrink-0">{r.images?.[0]&&<Image src={r.images[0]} alt={r.name} fill className="object-contain p-1"/>}</span>
              <span className="text-sm leading-5">{r.name}<br/><span className="text-black/75">{formatPrice(r.price)}</span></span>
            </a>)}
          </div>
        </div>}
      </aside>
    </section>
  </main>
}
