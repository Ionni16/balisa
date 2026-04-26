-- OKKA PREMIUM COMMERCE - SUPABASE SCHEMA
create extension if not exists "uuid-ossp";

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images text[] default '{}',
  colors text[] default '{}',
  category text not null default 'clutch',
  stock int not null default 0,
  featured boolean default false,
  material text,
  dimensions text,
  care text,
  stripe_price_id text,
  created_at timestamptz default now()
);

alter table products add column if not exists compare_at_price numeric(10,2);
alter table products add column if not exists material text;
alter table products add column if not exists dimensions text;
alter table products add column if not exists care text;
alter table products enable row level security;
drop policy if exists "Anyone can read products" on products;
create policy "Anyone can read products" on products for select using (true);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  hero_eyebrow text default 'Handmade statement bags from Italy',
  hero_title text default 'Colourful pieces for elevated summer dressing.',
  hero_subtitle text default 'OKKA creates limited-run crochet bags with sculptural texture, vivid colour and a made-by-hand finish.',
  hero_image text default '',
  announcement text default 'Worldwide shipping — handmade in limited quantities',
  instagram_url text default 'https://instagram.com/okka.boutique',
  instagram_handle text default '@okka.boutique',
  contact_email text default 'hello@okkaboutique.com',
  about_title text default 'Creativity, texture and fearless colour.',
  about_text text default 'Each OKKA bag is made in small batches with a focus on expressive colour, tactile yarns and distinctive silhouettes. No two pieces are exactly the same.',
  shipping_text text default 'Worldwide shipping available. Orders are prepared within 2–5 business days unless marked as made-to-order.',
  returns_text text default 'Returns are accepted within 14 days for unused items in original condition. Custom pieces are final sale.',
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;
drop policy if exists "Anyone can read site settings" on site_settings;
create policy "Anyone can read site settings" on site_settings for select using (true);
insert into site_settings default values on conflict do nothing;

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  stripe_session_id text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_address jsonb not null,
  items jsonb not null,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);
alter table orders enable row level security;

drop policy if exists "No direct access" on orders;
create policy "No direct access" on orders for all using (false);

insert into storage.buckets (id, name, public) values ('products','products',true) on conflict do nothing;
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id='products');

-- Service-role API routes handle product/order/settings mutations securely using ADMIN_SECRET_KEY.
