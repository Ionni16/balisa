"use client";
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  ['/', 'Home'], ['/shop', 'Shop'], ['/shop?category=clutch', 'Clutches'], ['/shop?category=beach', 'Beach Bags'], ['/#about', 'About']
];
export default function Navbar(){
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const [scrolled,setScrolled]=useState(false); const [open,setOpen]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(scrollY>20); h(); addEventListener('scroll',h,{passive:true}); return()=>removeEventListener('scroll',h)},[]);
  if(pathname.startsWith('/admin')) return null;
  return <>
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="bg-ink text-white text-center text-[11px] tracking-[.18em] uppercase py-2">Worldwide shipping · Limited handmade drops</div>
      <header className={`transition ${scrolled?'bg-white/94 backdrop-blur border-b border-black/10':'bg-white/88 backdrop-blur'}`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-20 flex items-center justify-between">
          <nav className="hidden lg:flex gap-7">{links.slice(0,4).map(([href,label])=><Link key={href} href={href} className="text-xs uppercase tracking-[.16em] text-ink/65 hover:text-ink">{label}</Link>)}</nav>
          <Link href="/" className="logo-word text-4xl leading-none">OKKA</Link>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="hidden sm:block p-3"><Search size={19}/></Link>
            <button onClick={openCart} className="relative p-3" aria-label="Cart"><ShoppingBag size={20}/>{itemCount()>0&&<span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gold text-white text-[10px] flex items-center justify-center">{itemCount()}</span>}</button>
            <button className="lg:hidden p-3" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
          </div>
        </div>
      </header>
    </div>
    {open&&<div className="fixed inset-0 z-40 bg-white pt-32 px-8 lg:hidden"><div className="flex flex-col gap-6">{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="font-serif text-4xl">{label}</Link>)}</div></div>}
  </>
}
