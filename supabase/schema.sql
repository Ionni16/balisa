-- ============================================================
-- BALISA E-COMMERCE - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null,
  price numeric(10,2) not null,
  images text[] default '{}',
  colors text[] default '{}',
  category text not null check (category in ('tote','mini','clutch','crossbody','shoulder')),
  stock int not null default 0,
  featured boolean default false,
  stripe_price_id text,
  created_at timestamptz default now()
);

-- Public read access for products
alter table products enable row level security;
create policy "Anyone can read products" on products for select using (true);
create policy "Admins can do everything" on products for all using (
  auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
create table orders (
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

-- Only admins can read orders (service role key used server-side)
alter table orders enable row level security;
create policy "No direct access" on orders for all using (false);

-- ============================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict do nothing;

-- Allow public to view images
create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'products');

-- Only authenticated admin can upload/delete
create policy "Admin can upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin can delete product images" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA (optional - remove in production)
-- ============================================================
insert into products (name, slug, description, price, colors, category, stock, featured) values
(
  'Blue Fringe Bag',
  'blue-fringe-bag',
  'Una borsa a maglia XXL con frange blu polvere, fatta interamente a mano con filato di cotone riciclato. Perfetta per l''estate.',
  89.00,
  ARRAY['Blu polvere'],
  'tote',
  3,
  true
),
(
  'Pink Bestie Bag',
  'pink-bestie-bag',
  'La nostra bag più amata — disponibile in rosa acceso. Spaziosa, colorata e impossibile da non notare.',
  95.00,
  ARRAY['Rosa fucsia'],
  'tote',
  5,
  true
),
(
  'Summer Garden Tote',
  'summer-garden-tote',
  'Un intreccio unico nei toni del verde salvia e rosa cipria. Ogni bag è un pezzo unico.',
  110.00,
  ARRAY['Salvia/Rosa'],
  'tote',
  2,
  true
),
(
  'Blush Mini Bag',
  'blush-mini-bag',
  'La versione mini della nostra bag più famosa. Compatta ma di grande impatto, in rosa cipria delicato.',
  75.00,
  ARRAY['Rosa cipria'],
  'mini',
  4,
  false
),
(
  'Mauve Clutch',
  'mauve-clutch',
  'Una clutch morbida e romantica in malva antico — il tocco perfetto per ogni outfit.',
  69.00,
  ARRAY['Malva'],
  'clutch',
  6,
  false
);
