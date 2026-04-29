import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import SmartImage from '@/components/SmartImage';
import NewsletterForm from '@/components/NewsletterForm';
import InstagramFeed from '@/components/InstagramFeed';
import { HeartHandshake, PackageCheck, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFeatured(): Promise<Product[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return (data as Product[]) || [];
}

async function getLatest(): Promise<Product[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  return (data as Product[]) || [];
}

export default async function HomePage() {
  const [settings, featured, latest] = await Promise.all([
    getSiteSettings(),
    getFeatured(),
    getLatest(),
  ]);

  const products = featured.length ? featured : latest;
  const hero =
    settings.hero_image_mobile ||
    settings.hero_image ||
    products[0]?.images?.[0] ||
    latest[0]?.images?.[0];

  const left = settings.purpose_image_left || products[0]?.images?.[0] || hero;
  const right = settings.purpose_image_right || products[1]?.images?.[0] || hero;

  const overlayOpacity = Math.max(
    0,
    Math.min(0.75, Number(settings.hero_overlay_opacity || 0.14))
  );

  const instagramPosts = [
    {
      image: settings.instagram_post_image_1 || products[0]?.images?.[0],
      url: settings.instagram_post_url_1 || settings.instagram_url,
    },
    {
      image: settings.instagram_post_image_2 || products[1]?.images?.[0],
      url: settings.instagram_post_url_2 || settings.instagram_url,
    },
    {
      image: settings.instagram_post_image_3 || products[2]?.images?.[0],
      url: settings.instagram_post_url_3 || settings.instagram_url,
    },
    {
      image: settings.instagram_post_image_4 || products[3]?.images?.[0] || hero,
      url: settings.instagram_post_url_4 || settings.instagram_url,
    },
  ];

  return (
    <main
      className="pt-[124px] md:pt-[102px]"
      style={{ background: settings.page_bg_color, color: settings.text_color }}
    >
      <section className="relative h-[calc(100svh-124px)] min-h-[520px] md:h-[calc(100svh-102px)] overflow-hidden bg-[var(--product-card-bg)]">
        <SmartImage src={hero} alt={`${settings.brand_name} hero`} />
        <div
          className="absolute inset-0"
          style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
        />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-5">
          <div>
            {settings.hero_eyebrow ? (
              <p className="kicker !text-white/75 mb-5">{settings.hero_eyebrow}</p>
            ) : null}
            <h1 className="hero-title text-white max-w-[1050px]">
              {settings.hero_title}
            </h1>
          </div>
        </div>
      </section>

      <section className="site-shell py-10 lg:py-14">
        <div className="mb-8 md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <h2 className="text-[20px] font-normal tracking-[.01em] mb-2">
              {settings.best_sellers_title}
            </h2>
            {settings.best_sellers_subtitle ? (
              <p className="text-[14px] md:text-[15px] text-black/55 max-w-[620px] leading-7">
                {settings.best_sellers_subtitle}
              </p>
            ) : null}
          </div>

          <Link
            href="/shop"
            className="hidden md:inline-flex text-[14px] text-black/65 hover:text-black underline-offset-4 hover:underline"
          >
            Shop all
          </Link>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-11">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="product-bg py-20 text-center">
            <h3 className="text-3xl font-light">No products yet</h3>
            <p className="mt-3 text-black/55">
              Add your first products from the admin area.
            </p>
          </div>
        )}
      </section>

      <section id="about" className="bg-white">
        <div className="purpose-mosaic">
          <div className="purpose-tile purpose-tile-left">
            <SmartImage src={left} alt="Balisa lifestyle left" />
          </div>
          <div className="purpose-tile purpose-tile-right">
            <SmartImage src={right} alt="Balisa lifestyle right" />
          </div>

          <Link
            href={settings.purpose_button_url || `mailto:${settings.contact_email}`}
            className="contact-overlay-btn"
          >
            {settings.purpose_button_label || 'Contact us'}
          </Link>
        </div>

        <InstagramFeed
          handle={settings.instagram_handle}
          instagramUrl={settings.instagram_url}
          mode={settings.instagram_feed_mode || 'manual'}
          manualPosts={instagramPosts}
        />
      </section>

      <section className="newsletter-shell">
        <NewsletterForm
          title={settings.newsletter_title || "Let's keep in touch"}
          text={
            settings.newsletter_text ||
            'Be the first to know about new collections and get early access.'
          }
          contactEmail={settings.contact_email}
        />
      </section>

      <section id="contact" className="site-shell info-section">
        <div className="info-premium-clean">
          <div className="info-premium-header">
            <span className="info-mini-pill">More info</span>
            <h2>{settings.about_title}</h2>
            <p>{settings.about_text}</p>

            <div className="info-quick-links">
              <a href="#shipping-card">Shipping</a>
              <a href="#returns-card">Returns</a>
              <a href="#care-card">Care</a>
              <a href={`mailto:${settings.contact_email}`}>Contact</a>
            </div>
          </div>

          <div className="info-cards-grid">
            <article id="shipping-card" className="info-policy-card">
              <div className="info-policy-icon">
                <PackageCheck size={26} strokeWidth={1.55} aria-hidden="true" />
              </div>
              <div>
                <span>Shipping</span>
                <p>{settings.shipping_text}</p>
              </div>
            </article>

            <article id="returns-card" className="info-policy-card">
              <div className="info-policy-icon">
                <RotateCcw size={26} strokeWidth={1.55} aria-hidden="true" />
              </div>
              <div>
                <span>Returns</span>
                <p>{settings.returns_text}</p>
              </div>
            </article>

            <article id="care-card" className="info-policy-card">
              <div className="info-policy-icon">
                <HeartHandshake size={26} strokeWidth={1.55} aria-hidden="true" />
              </div>
              <div>
                <span>Care</span>
                <p>{settings.care_text}</p>
              </div>
            </article>

            <article className="info-contact-card">
              <span>Contact</span>
              <p>Need help with an order, a custom request or product details? We usually reply quickly by email.</p>
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
