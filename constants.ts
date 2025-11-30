import { Product, ProductType, AnalyticsMetrics, Shop } from './types';

export const SQL_SCHEMA_CODE = `
-- Oosma Database Schema (Supabase/PostgreSQL)

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('buyer', 'seller');
create type product_type_enum as enum ('affiliate_physical', 'digital_download', 'service');

-- 1. Profiles (Linked to Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role user_role default 'buyer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Shops (Linked to Seller Profiles)
create table shops (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade not null,
  shop_name text not null,
  slug text not null unique,
  logo_url text,
  banner_url text,
  wallet_balance decimal(12, 2) default 0.00,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products (Hybrid Logic)
create table products (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid references shops(id) on delete cascade not null,
  title text not null,
  description text,
  price decimal(10, 2), -- Nullable if affiliate (optional, but usually they have a price to display)
  
  -- Logic: If affiliate_link is not null, it's an affiliate product
  affiliate_link text, 
  product_type product_type_enum not null,
  
  images text[],
  video_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Analytics
create table analytics (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  views int default 0,
  clicks int default 0,
  sales_count int default 0,
  revenue decimal(12, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Security Policies (RLS)
alter table profiles enable row level security;
alter table shops enable row level security;
alter table products enable row level security;

create policy "Public shops" on shops for select using (true);
create policy "Public products" on products for select using (true);
create policy "Sellers update own shop" on shops for update using (auth.uid() = profile_id);
`;

export const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    profile_id: 'user-1',
    shop_name: 'Tech Haven',
    slug: 'tech-haven',
    logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=TH',
    banner_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600',
    verified: true,
    wallet_balance: 1250.00
  },
  {
    id: 'shop-2',
    profile_id: 'user-2',
    shop_name: 'Creator Studio',
    slug: 'creator-studio',
    logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=CS',
    banner_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
    verified: true,
    wallet_balance: 4500.50
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    shop_id: 'shop-1',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry leading noise cancellation, crystal clear sound, and 30-hour battery life. The best choice for commuters.',
    price: 348.00,
    affiliate_link: 'https://amazon.com/dp/example',
    product_type: ProductType.AFFILIATE_PHYSICAL,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'],
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 2450
  },
  {
    id: '2',
    shop_id: 'shop-2',
    title: 'Complete Next.js 14 Boilerplate',
    description: 'Ship your startup in days, not weeks. Includes Supabase, Stripe, and Tailwind setup.',
    price: 99.00,
    affiliate_link: undefined, // Direct Product
    product_type: ProductType.DIGITAL_DOWNLOAD,
    images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'],
    category: 'Software',
    rating: 5.0,
    reviewCount: 120
  },
  {
    id: '3',
    shop_id: 'shop-1',
    title: 'MacBook Pro M3 Max 16"',
    description: 'Mind-blowing performance. The most advanced chips ever built for a personal computer.',
    price: 3499.00,
    affiliate_link: 'https://apple.com/macbook-pro',
    product_type: ProductType.AFFILIATE_PHYSICAL,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800'],
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 890
  },
  {
    id: '4',
    shop_id: 'shop-2',
    title: '1-on-1 Code Review Session',
    description: '1 hour deep dive into your codebase. I will help you optimize your React patterns and database queries.',
    price: 150.00,
    affiliate_link: undefined, // Direct Service
    product_type: ProductType.SERVICE,
    images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800'],
    category: 'Consulting',
    rating: 5.0,
    reviewCount: 45
  },
  {
    id: '5',
    shop_id: 'shop-1',
    title: 'Mechanical Keychron Q1',
    description: 'Fully assembled knob version. Double-gasket design.',
    price: 179.00,
    affiliate_link: 'https://keychron.com',
    product_type: ProductType.AFFILIATE_PHYSICAL,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800'],
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 320
  }
];

export const MOCK_ANALYTICS: AnalyticsMetrics[] = [
  { product_id: '1', views: 1200, clicks: 450, sales_count: 0, revenue: 0 },
  { product_id: '2', views: 800, clicks: 120, sales_count: 15, revenue: 1485 },
  { product_id: '3', views: 2500, clicks: 890, sales_count: 0, revenue: 0 },
  { product_id: '4', views: 300, clicks: 45, sales_count: 2, revenue: 300 },
  { product_id: '5', views: 600, clicks: 150, sales_count: 0, revenue: 0 }
];