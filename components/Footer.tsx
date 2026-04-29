import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import { ArrowRight, Instagram, Music2, Pin } from 'lucide-react';

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="footer-modern">
      <div className="site-shell footer-modern-top">
        <div>
          <p className="footer-modern-title">More info</p>
          <div className="footer-modern-links">
            <Link href="/#contact">Care Instructions</Link>
            <Link href="/#contact">Shipping policy</Link>
            <Link href="/#contact">Return Policy</Link>
            <a href={`mailto:${settings.contact_email}`}>Contact Us</a>
          </div>
        </div>

        <div>
          <p className="footer-modern-title">Social</p>
          <div className="footer-socials footer-socials-list">
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={20} strokeWidth={1.8} />
              <span>Instagram</span>
            </a>
            {settings.pinterest_url ? (
              <a href={settings.pinterest_url} target="_blank" rel="noreferrer" aria-label="Pinterest">
                <Pin size={20} strokeWidth={1.8} />
                <span>Pinterest</span>
              </a>
            ) : null}
            {settings.tiktok_url ? (
              <a href={settings.tiktok_url} target="_blank" rel="noreferrer" aria-label="TikTok">
                <Music2 size={20} strokeWidth={1.8} />
                <span>TikTok</span>
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="footer-modern-title">Join the list</p>
          <p className="footer-newsletter-copy">
            Be the first to know about new arrivals, limited pieces and more.
          </p>
          <form className="footer-newsletter-form" action={`mailto:${settings.contact_email}`}>
            <input type="email" name="email" placeholder="Enter your email" aria-label="Email address" />
            <button type="submit" aria-label="Submit email">
              <ArrowRight size={20} strokeWidth={1.8} />
            </button>
          </form>
        </div>

        <div className="footer-region footer-region-desktop">
          <p>Country / region</p>
          <div className="region-selector">Italy | EUR € <span>⌄</span></div>
          <div className="footer-payments" aria-label="Payment methods">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>PayPal</span>
            <span>AMEX</span>
            <span>Google Pay</span>
            <span>Shop Pay</span>
            <span>Klarna</span>
          </div>
        </div>
      </div>

      <div className="site-shell footer-modern-bottom">
        <p>© 2026 {settings.brand_name}. All rights reserved.</p>
        <div className="footer-legal-links">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <a href={`mailto:${settings.contact_email}`}>Contact</a>
        </div>
      </div>
    </footer>
  );
}
