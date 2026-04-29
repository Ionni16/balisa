import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';

export const dynamic='force-dynamic';
export const revalidate=0;

async function getFeatured():Promise<Product[]>{
  if(!supabase)return[];
  const{data}=await supabase.from('products').select('*').eq('featured',true).order('created_at',{ascending:false}).limit(8);
  return(data as Product[])||[];
}
async function getLatest():Promise<Product[]>{
  if(!supabase)return[];
  const{data}=await supabase.from('products').select('*').order('created_at',{ascending:false}).limit(8);
  return(data as Product[])||[];
}
function SmartImage({src,alt,priority=false,contain=false}:{src?:string;alt:string;priority?:boolean;contain?:boolean}){
  return src?<Image src={src} alt={alt} fill priority={priority} className={contain?"object-contain":"object-cover"}/>:<div className="h-full w-full bg-[#eeeeee]"/>;
}

export default async function HomePage(){
  const[settings,featured,latest]=await Promise.all([getSiteSettings(),getFeatured(),getLatest()]);
  const products=featured.length?featured:latest;
  const hero=settings.hero_image||products[0]?.images?.[0]||latest[0]?.images?.[0];
  const left=settings.purpose_image_left||products[0]?.images?.[0]||hero;
  const right=settings.purpose_image_right||products[1]?.images?.[0]||hero;

  return <main className="pt-[124px]">
    <section className="relative h-[calc(100svh-124px)] min-h-[560px] overflow-hidden bg-[#eee]">
      <div className="absolute inset-0">
        <SmartImage src={hero} alt={`${settings.brand_name} hero`} priority/>
        <div className="absolute inset-0 bg-black/20"/>
      </div>
      <div className="relative z-10 h-full flex items-center justify-center text-center px-5">
        <h1 className="hero-title text-white">{settings.hero_title}</h1>
      </div>
    </section>

    <section className="site-shell py-10 lg:py-14">
      <h2 className="text-[20px] font-normal tracking-[.01em] mb-8">{settings.best_sellers_title}</h2>
      {products.length?<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-11">{products.slice(0,8).map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="product-bg py-20 text-center"><h3 className="text-3xl font-light">No products yet</h3><p className="mt-3 text-black/55">Add your first products from the admin area.</p></div>}
    </section>

    <section id="about" className="bg-white">
      <div className="site-shell py-16 lg:py-20 text-center">
        <h2 className="purpose-title">{settings.purpose_title}</h2>
        <p className="mx-auto mt-7 max-w-4xl text-[20px] text-black/68 leading-[1.75]">{settings.purpose_text}</p>
      </div>

      <div className="relative grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[#eee]"><SmartImage src={left} alt="Balisa lifestyle 1"/></div>
        <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[#eee]"><SmartImage src={right} alt="Balisa lifestyle 2"/></div>

        <Link
          href={settings.purpose_button_url||`mailto:${settings.contact_email}`}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-12 py-5 text-[16px] font-semibold tracking-[.01em] text-black shadow-[0_20px_45px_rgba(0,0,0,.10)] hover:bg-black hover:text-white transition-colors"
        >
          {settings.purpose_button_label}
        </Link>
      </div>
    </section>

    <section id="contact" className="bg-white">
      <div className="site-shell py-20 lg:py-24">
        <div className="mb-12 text-center">
          <p className="text-[12px] tracking-[.22em] uppercase text-black/40 mb-4">Customer care</p>
          <h2 className="text-[42px] lg:text-[58px] leading-none tracking-[-.05em] font-normal">Everything you need</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="care-card">
            <span className="care-number">01</span>
            <h3>Shipping</h3>
            <p>{settings.shipping_text}</p>
          </div>
          <div className="care-card">
            <span className="care-number">02</span>
            <h3>Care instructions</h3>
            <p>{settings.care_text}</p>
          </div>
          <div className="care-card">
            <span className="care-number">03</span>
            <h3>Contact</h3>
            <p><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a><br/><a href={settings.instagram_url} target="_blank" rel="noreferrer">{settings.instagram_handle}</a></p>
          </div>
        </div>
      </div>
    </section>
  </main>
}
