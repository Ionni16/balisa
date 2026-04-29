-- BALISA — Supabase schema completo
-- Esegui questo file nel SQL Editor di Supabase.
-- Dopo l'esecuzione crea/verifica anche il bucket Storage pubblico chiamato: products

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  images text[] not null default '{}',
  colors text[] not null default '{}',
  category text not null default 'mini',
  stock integer not null default 0,
  featured boolean not null default false,
  material text default '',
  dimensions text default '',
  care text default '',
  stripe_price_id text,
  created_at timestamptz not null default now()
);

create index if not exists products_featured_idx on public.products(featured);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_created_at_idx on public.products(created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_name text,
  customer_email text,
  customer_address jsonb,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text default 'Balisa',
  logo_url text default '/logo_balisa_Senza.png',
  favicon_url text default '',
  announcement text default 'Ready-Made bags | Only 1 available for each',
  announcement_url text default '/shop',

  hero_eyebrow text default '',
  hero_title text default 'THE summer bags',
  hero_subtitle text default '',
  hero_image text default '',
  hero_image_mobile text default '',
  hero_button_label text default 'Shop now',
  hero_button_url text default '/shop',
  secondary_button_label text default 'Custom orders',
  secondary_button_url text default '/#contact',

  best_sellers_title text default 'Best sellers',
  best_sellers_subtitle text default '',

  purpose_eyebrow text default '',
  purpose_title text default 'Made with purpose',
  purpose_text text default 'Discover the beauty of sustainable fashion with our handmade crochet bags. Each bag is made to order, reducing waste and embracing slow fashion. Designed for everyday style.',
  purpose_image_left text default '',
  purpose_image_right text default '',
  purpose_button_label text default 'Contact us',
  purpose_button_url text default 'mailto:hello@balisa.it',

  about_title text default 'Handmade crochet bags designed for everyday style.',
  about_text text default 'Balisa creates small-batch crochet bags with soft shapes, expressive colours and a clean handmade finish. Each piece is crafted to feel personal, tactile and made to last.',

  shipping_text text default 'Shipping is calculated at check-out. Ready-made pieces are prepared within 2–5 business days. Made-to-order timelines are confirmed before production.',
  returns_text text default 'Returns are accepted within 14 days for unused ready-made items in original condition. Custom pieces are final sale.',
  care_text text default 'Hand wash in cold water with mild soap and lay flat to dry.',

  contact_email text default 'hello@balisa.it',
  instagram_url text default 'https://instagram.com/balisa',
  instagram_handle text default '@balisa',
  tiktok_url text default '',
  pinterest_url text default '',

  newsletter_title text default 'Join the Balisa list',
  newsletter_text text default 'Be first to know about limited drops, custom openings and new colour stories.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  brand_name,
  announcement,
  announcement_url,
  hero_title,
  best_sellers_title,
  purpose_title,
  purpose_text,
  purpose_button_label,
  purpose_button_url,
  about_text,
  shipping_text,
  care_text,
  contact_email,
  instagram_handle,
  instagram_url
)
select
  'Balisa',
  'Ready-Made bags | Only 1 available for each',
  '/shop',
  'THE summer bags',
  'Best sellers',
  'Made with purpose',
  'Discover the beauty of sustainable fashion with our handmade crochet bags. Each bag is made to order, reducing waste and embracing slow fashion. Designed for everyday style.',
  'Contact us',
  'mailto:hello@balisa.it',
  'Balisa creates small-batch crochet bags with soft shapes, expressive colours and a clean handmade finish. Each piece is crafted to feel personal, tactile and made to last.',
  'Shipping is calculated at check-out. Ready-made pieces are prepared within 2–5 business days. Made-to-order timelines are confirmed before production.',
  'Hand wash in cold water with mild soap and lay flat to dry.',
  'hello@balisa.it',
  '@balisa',
  'https://instagram.com/balisa'
where not exists (select 1 from public.site_settings);

-- RLS: il sito pubblico può leggere prodotti e impostazioni.
-- Le modifiche avvengono solo dalle API server usando SUPABASE_SERVICE_ROLE_KEY.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

-- Storage policies per bucket pubblico "products".
-- Se il bucket non esiste, crealo da Supabase Dashboard:
-- Storage -> New bucket -> name: products -> Public bucket: ON

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'products');

drop policy if exists "Service role can manage product images" on storage.objects;
create policy "Service role can manage product images"
on storage.objects for all
using (bucket_id = 'products')
with check (bucket_id = 'products');
