"use client";

import Link from 'next/link';
import Image from 'next/image';
import {ShoppingBag,Menu,X,Search,UserRound} from 'lucide-react';
import {useCartStore} from '@/lib/store';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {DEFAULT_SETTINGS} from '@/lib/settings';
import type {SiteSettings} from '@/lib/types';

const links=[['/','Home'],['/shop','New In'],['/shop','Bags'],['/#contact','Custom Orders'],['/#about','Accessories']];

export default function Navbar(){
  const pathname=usePathname();
  const router=useRouter();
  const{itemCount,openCart}=useCartStore();
  const[settings,setSettings]=useState<SiteSettings>(DEFAULT_SETTINGS);
  const[open,setOpen]=useState(false);
  const[searchOpen,setSearchOpen]=useState(false);
  const[query,setQuery]=useState('');

  useEffect(()=>{
    let alive=true;
    const load=()=>fetch(`/api/settings?t=${Date.now()}`,{cache:'no-store'})
      .then(r=>r.ok?r.json():null)
      .then(d=>{if(alive&&d)setSettings({...DEFAULT_SETTINGS,...d})})
      .catch(()=>null);
    load();
    const onFocus=()=>load();
    const onStorage=(e:StorageEvent)=>{if(e.key==='balisa-settings-updated')load()};
    window.addEventListener('focus',onFocus);
    window.addEventListener('storage',onStorage);
    return()=>{alive=false;window.removeEventListener('focus',onFocus);window.removeEventListener('storage',onStorage)};
  },[]);

  if(pathname.startsWith('/admin'))return null;

  function submitSearch(e:React.FormEvent){
    e.preventDefault();
    const q=query.trim();
    setSearchOpen(false);
    if(q) router.push(`/shop?search=${encodeURIComponent(q)}`);
    else router.push('/shop');
  }

  return <>
    <div className="fixed inset-x-0 top-0 z-50">
      {settings.announcement&&
        <Link href={settings.announcement_url||'/shop'} className="announcement-bar">
          <span className="announcement-inner">
            <span className="announcement-text">{settings.announcement}</span>
            <span className="announcement-arrow" aria-hidden>→</span>
          </span>
        </Link>
      }

      <header className="main-header">
        <div className="site-shell header-row">
          <div className="mobile-header-left">
            <button className="header-icon mobile-only" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={30}/>:<Menu size={34}/>}</button>
          </div>

          <nav className="header-nav">
            {links.map(([href,label],idx)=>
              <Link key={`${href}-${label}`} href={href} className={`nav-link ${idx===0&&pathname==='/'?'nav-link-active':''}`}>{label}</Link>
            )}
          </nav>

          <Link href="/" className="header-logo" aria-label={settings.brand_name}>
            {settings.logo_url
              ? <Image src={settings.logo_url} alt={settings.brand_name} width={160} height={58} className="h-9 w-auto object-contain" unoptimized priority/>
              : <span className="logo-word text-3xl">{settings.brand_name}</span>}
          </Link>

          <div className="header-actions">
            <span className="currency-label desktop-only">Italy | EUR €</span>
            <button onClick={()=>setSearchOpen(true)} className="header-icon" aria-label="Search products"><Search size={23} strokeWidth={1.6}/></button>
            <Link href="/admin" className="header-icon hide-on-mobile" aria-label="Admin"><UserRound size={23} strokeWidth={1.6}/></Link>
            <button onClick={openCart} className="header-icon relative" aria-label="Cart">
              <ShoppingBag size={24} strokeWidth={1.7}/>
              {itemCount()>0&&<span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white text-[12px] flex items-center justify-center">{itemCount()}</span>}
            </button>
          </div>
        </div>
      </header>
    </div>

    {searchOpen&&<div className="fixed inset-0 z-[70] bg-white/96 backdrop-blur-sm">
      <button className="absolute right-6 top-6 p-3" onClick={()=>setSearchOpen(false)} aria-label="Close search"><X size={28}/></button>
      <form onSubmit={submitSearch} className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-3xl">
          <p className="text-center text-[13px] tracking-[.18em] uppercase text-black/40 mb-6">Search Balisa</p>
          <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..." className="w-full border-0 border-b border-black/25 focus:border-black outline-none text-center text-4xl lg:text-6xl py-5 bg-transparent font-light"/>
          <div className="mt-8 text-center"><button className="btn-keylon">Search</button></div>
        </div>
      </form>
    </div>}

    {open&&<div className="fixed inset-0 z-40 bg-white pt-[126px] px-8 lg:hidden">
      <div className="flex flex-col gap-7">{links.map(([href,label])=><Link key={`${href}-${label}-mobile`} href={href} onClick={()=>setOpen(false)} className="text-4xl tracking-[-.04em]">{label}</Link>)}</div>
      <div className="mt-10 pt-8 border-t border-black/10 text-sm text-black/55 grid gap-3"><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a><a href={settings.instagram_url} target="_blank" rel="noreferrer">{settings.instagram_handle}</a></div>
    </div>}
  </>
}
