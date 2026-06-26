-- ASPECT DATABASE SCHEMA SETUP
-- Copy and paste this script in your Supabase SQL Editor to initialize the database tables and mock products.

-- Drop existing tables if they exist
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;

-- 1. Create Products Table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  category text not null,
  sizes text[] default array['S', 'M', 'L', 'XL']::text[],
  stock_quantity integer default 10,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) but allow public reads and standard public inserts/updates
alter table public.products enable row level security;

create policy "Allow public read access to products"
  on public.products for select
  using (true);

create policy "Allow all access to products for authenticated users (admins)"
  on public.products for all
  using (true)
  with check (true);

-- 2. Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_code text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  payment_method text not null check (payment_method in ('cod', 'online')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  order_status text not null default 'pending' check (order_status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Allow public to insert orders"
  on public.orders for insert
  with check (true);

create policy "Allow public to read their own orders via code check"
  on public.orders for select
  using (true);

create policy "Allow full access to orders for authenticated users (admins)"
  on public.orders for all
  using (true)
  with check (true);

-- 3. Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  size text not null,
  price_at_purchase numeric(10, 2) not null
);

alter table public.order_items enable row level security;

create policy "Allow public to insert order items"
  on public.order_items for insert
  with check (true);

create policy "Allow public to read order items"
  on public.order_items for select
  using (true);

create policy "Allow full access to order items for authenticated users (admins)"
  on public.order_items for all
  using (true)
  with check (true);

-- 4. Seed Mock Clothing Products
insert into public.products (name, description, price, image_url, category, sizes, stock_quantity, in_stock) values
(
  'Aspect Minimalist Trench',
  'A classic double-breasted trench coat crafted from a premium water-resistant cotton blend. Features a relaxed silhouette, adjustable belted cuffs, and a storm flap. Perfect for transitional styling.',
  189.00,
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=60',
  'Outerwear',
  array['S', 'M', 'L', 'XL'],
  12,
  true
),
(
  'Aspect Oversized Heavyweight Tee',
  'Made from 240GSM organic cotton, this tee offers a structured drape and boxy fit. Features a thick ribbed collar and dropped shoulders for a modern street style silhouette.',
  45.00,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
  'Essentials',
  array['S', 'M', 'L'],
  25,
  true
),
(
  'Aspect Tailored Linen Trouser',
  'Lightweight and breathable trousers crafted from pure Belgian flax linen. Features a mid-rise waist, pleated front details, and a straight-leg cut for effortless warm-weather elegance.',
  95.00,
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60',
  'Pants',
  array['M', 'L', 'XL'],
  8,
  true
),
(
  'Aspect Classic Knit Sweater',
  'Woven from a luxurious merino wool and cashmere blend. Designed with a clean crewneck collar, ribbed hem, and subtle textured stitching that brings warmth and sophisticated texture to any outfit.',
  120.00,
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=60',
  'Essentials',
  array['S', 'M', 'L', 'XL'],
  15,
  true
),
(
  'Aspect Cropped Ribbed Cardigan',
  'A feminine, fitted cardigan in a soft ribbed knit structure. Features front button closures and a delicate V-neck. An essential layering piece designed for high-waisted styling.',
  75.00,
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60',
  'Outerwear',
  array['S', 'M'],
  6,
  true
),
(
  'Aspect Leather Utility Jacket',
  'Crafted from butter-soft vegan leather, featuring a clean collar, front zip closure, and large utility cargo pockets. Designed with an elastic waistband for comfort and structure.',
  145.00,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60',
  'Outerwear',
  array['M', 'L', 'XL'],
  10,
  true
);
