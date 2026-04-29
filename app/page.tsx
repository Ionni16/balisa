import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import SmartImage from '@/components/SmartImage';
import NewsletterForm from '@/components/NewsletterForm';

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

  const socialImages = [
    products[0]?.images?.[0],
    left,
    products[1]?.images?.[0],
    right,
  ].filter(Boolean) as string[];

  while (socialImages.length < 4 && hero) {
    socialImages.push(hero);
  }

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
        <div className="relative grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[var(--product-card-bg)]">
            <SmartImage src={left} alt="Balisa lifestyle 1" />
          </div>

          <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-[var(--product-card-bg)]">
            <SmartImage src={right} alt="Balisa lifestyle 2" />
          </div>

          <Link
            href={settings.purpose_button_url || `mailto:${settings.contact_email}`}
            className="contact-overlay-btn"
          >
            {settings.purpose_button_label}
          </Link>
        </div>

        <div className="site-shell py-12 lg:py-16 text-center">
          <p className="social-handle">{settings.instagram_handle}</p>

          <div className="social-grid mt-8">
            {socialImages.slice(0, 4).map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="social-grid-item">
                <SmartImage src={imageUrl} alt={`Balisa detail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell py-3 lg:py-6">
        <NewsletterForm
          title={settings.newsletter_title || "Let's keep in touch"}
          text={
            settings.newsletter_text ||
            'Be the first to know about new collections and get early access.'
          }
          contactEmail={settings.contact_email}
        />
      </section>

      <section id="contact" className="site-shell pt-4 pb-16 lg:pt-6 lg:pb-20">
        <div className="info-stack">
          <div>
            <h2 className="info-heading">More info</h2>

            <div className="info-links">
              <a href={`mailto:${settings.contact_email}`}>Contact us</a>
              <a href="#contact">Shipping policy</a>
              <a href="#contact">Return policy</a>
              <a href="#contact">Care instructions</a>
            </div>
          </div>

          <div className="info-copy">
            <h3>{settings.about_title}</h3>
            <p>{settings.about_text}</p>

            <div className="grid gap-6 md:grid-cols-3 mt-8 text-[15px] leading-7 text-black/62">
              <div>
                <p className="info-mini-title">Shipping</p>
                <p>{settings.shipping_text}</p>
              </div>

              <div>
                <p className="info-mini-title">Returns</p>
                <p>{settings.returns_text}</p>
              </div>

              <div>
                <p className="info-mini-title">Care</p>
                <p>{settings.care_text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
