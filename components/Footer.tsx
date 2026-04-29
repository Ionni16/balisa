import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import { Instagram, Music2, Pin } from 'lucide-react';

export default async function Footer(){
  const settings=await getSiteSettings();

  return <footer className="footer-modern" style={{background:settings.footer_bg_color,color:settings.footer_text_color}}>
    <div className="site-shell footer-modern-top">
      <div>
        <p className="footer-modern-title">More info</p>
        <div className="footer-modern-links">
          <a href={`mailto:${settings.contact_email}`}>Contact us</a>
          <Link href="/#contact">Care Instructions</Link>
          <Link href="/#contact">Shipping policy</Link>
          <Link href="/#contact">Return policy</Link>
        </div>
      </div>

      <div>
        <p className="footer-modern-title">Social</p>
        <div className="footer-socials">
          <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={26} strokeWidth={1.8}/></a>
          {settings.tiktok_url&&<a href={settings.tiktok_url} target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={25} strokeWidth={1.8}/></a>}
          {settings.pinterest_url&&<a href={settings.pinterest_url} target="_blank" rel="noreferrer" aria-label="Pinterest"><Pin size={25} strokeWidth={1.8}/></a>}
        </div>
      </div>
    </div>

    <div className="site-shell footer-modern-bottom">
      <p>© 2026 {settings.brand_name}</p>
      <div className="footer-legal-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <a href={`mailto:${settings.contact_email}`}>Contact</a>
      </div>
    </div>
  </footer>
}
