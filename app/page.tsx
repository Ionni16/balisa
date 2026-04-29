import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import SmartImage from '@/components/SmartImage';

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

export default async function HomePage(){
  const[settings,featured,latest]=await Promise.all([getSiteSettings(),getFeatured(),getLatest()]);
  const products=featured.length?featured:latest;
  const hero=settings.hero_image_mobile || settings.hero_image || products[0]?.images?.[0] || latest[0]?.images?.[0];
  const left=settings.purpose_image_left||products[0]?.images?.[0]||hero;
  const right=settings.purpose_image_right||products[1]?.images?.[0]||hero;
  const overlayOpacity=Math.max(0,Math.min(0.75,Number(settings.hero_overlay_opacity||0.14)));

  return <main className="pt-[124px] md:pt-[124px] md:pt-[102px]" style={{background:settings.page_bg_color,color:settings.text_color}}>
    <section className="relative h-[calc(100svh-102px)] min-h-[590px] md:h-[calc(100svh-102px)] overflow-hidden bg-[var(--product-card-bg)]">
      <SmartImage src={hero} alt={`${settings.brand_name} hero`}/>
      <div className="absolute inset-0" style={{background:`rgba(0,0,0,${overlayOpacity})`}}/>
      <div className="relative z-10 h-full flex items-center justify-center text-center px-5">
        <h1 className="hero-title text-white max-w-[1050px]">{settings.hero_title}</h1>
      </div>
    </section>

    <section className="site-shell py-10 lg:py-14">
      <h2 className="text-[20px] font-normal tracking-[.01em] mb-8">{settings.best_sellers_title}</h2>
      {products.length?<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-11">{products.slice(0,8).map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="product-bg py-20 text-center"><h3 className="text-3xl font-light">No products yet</h3><p className="mt-3 text-black/55">Add your first products from the admin area.</p></div>}
    </section>

    <section id="about" className="bg-white">
      <div className="site-shell py-16 lg:py-20 text-center">
        <h2 className="purpose-title">{settings.purpose_title}</h2>
        <p className="mx-auto mt-7 max-w-4xl text-[18px] md:text-[20px] text-black/68 leading-[1.75]">{settings.purpose_text}</p>
      </div>

      <div className="relative grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[var(--product-card-bg)]"><SmartImage src={left} alt="Balisa lifestyle 1"/></div>
        <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[var(--product-card-bg)]"><SmartImage src={right} alt="Balisa lifestyle 2"/></div>

        <Link
          href={settings.purpose_button_url||`mailto:${settings.contact_email}`}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-8 md:px-12 py-4 md:py-5 text-[15px] md:text-[16px] font-semibold tracking-[.01em] text-black shadow-[0_20px_45px_rgba(0,0,0,.10)] hover:bg-black hover:text-white transition-colors whitespace-nowrap min-w-[150px] md:min-w-[168px] text-center"
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
            <div><h3>Shipping</h3><p>{settings.shipping_text}</p></div>
          </div>
          <div className="care-card">
            <span className="care-number">02</span>
            <div><h3>Care instructions</h3><p>{settings.care_text}</p></div>
          </div>
          <div className="care-card">
            <span className="care-number">03</span>
            <div><h3>Contact</h3><p><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a><br/><a href={settings.instagram_url} target="_blank" rel="noreferrer">{settings.instagram_handle}</a></p></div>
          </div>
        </div>
      </div>
    </section>
  </main>
}
