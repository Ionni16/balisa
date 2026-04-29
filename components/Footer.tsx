import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import Image from 'next/image';

export default async function Footer(){
  const settings=await getSiteSettings();

  return <footer style={{background:settings.footer_bg_color,color:settings.footer_text_color}}>
    <div className="site-shell py-14 lg:py-20">
      <div className="grid gap-11 lg:grid-cols-[1.15fr_.85fr_.85fr_.85fr]">
        <div>
          <Link href="/" className="inline-flex items-center mb-7">
            {settings.logo_url
              ? <Image src={settings.logo_url} alt={settings.brand_name} width={170} height={62} className="h-12 w-auto object-contain invert brightness-0" unoptimized/>
              : <span className="logo-word text-5xl">{settings.brand_name}</span>}
          </Link>
          <p className="max-w-[520px] text-[16px] leading-[1.85] text-white/72">{settings.about_text}</p>
        </div>

        <div>
          <h3 className="footer-title">Shop</h3>
          <div className="footer-links">
            <Link href="/shop">All products</Link>
            <Link href="/shop?category=mini">Mini bags</Link>
            <Link href="/shop?category=beach">Beach bags</Link>
            <Link href="/shop?category=custom">Custom</Link>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Support</h3>
          <div className="footer-links">
            <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            <Link href="/#contact">Shipping & returns</Link>
            <Link href="/#about">About Balisa</Link>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Social</h3>
          <div className="footer-links">
            <a href={settings.instagram_url} target="_blank" rel="noreferrer">{settings.instagram_handle}</a>
            {settings.tiktok_url&&<a href={settings.tiktok_url} target="_blank" rel="noreferrer">TikTok</a>}
            {settings.pinterest_url&&<a href={settings.pinterest_url} target="_blank" rel="noreferrer">Pinterest</a>}
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="site-shell py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[.22em] text-white/45 text-center">
        <span>© 2026 Balisa</span>
        <span>Handmade crochet bags</span>
      </div>
    </div>
  </footer>
}
