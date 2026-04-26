import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
export default async function Footer(){
  const s = await getSiteSettings();
  return <footer className="bg-ink text-white mt-24">
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16 grid md:grid-cols-[1.4fr_.8fr_.8fr_.8fr] gap-10">
      <div><div className="logo-word text-5xl mb-5">OKKA</div><p className="text-white/55 max-w-sm leading-7">Premium handmade crochet bags designed for expressive, international summer dressing.</p></div>
      <div><h3 className="text-xs uppercase tracking-[.2em] mb-4 text-white/45">Shop</h3><div className="grid gap-3 text-sm text-white/70"><Link href="/shop">All products</Link><Link href="/shop?category=clutch">Clutches</Link><Link href="/shop?category=beach">Beach bags</Link></div></div>
      <div><h3 className="text-xs uppercase tracking-[.2em] mb-4 text-white/45">Support</h3><div className="grid gap-3 text-sm text-white/70"><a href={`mailto:${s.contact_email}`}>{s.contact_email}</a><Link href="/#faq">Shipping & returns</Link><Link href="/#about">About OKKA</Link></div></div>
      <div><h3 className="text-xs uppercase tracking-[.2em] mb-4 text-white/45">Social</h3><a className="text-sm text-white/70" href={s.instagram_url} target="_blank">{s.instagram_handle}</a></div>
    </div>
    <div className="border-t border-white/10 px-5 lg:px-10 py-5 text-center text-[11px] uppercase tracking-[.18em] text-white/35">© {new Date().getFullYear()} OKKA Boutique</div>
  </footer>
}
