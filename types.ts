export enum ProductType {
  AFFILIATE_PHYSICAL = 'affiliate_physical',
  DIGITAL_DOWNLOAD = 'digital_download',
  SERVICE = 'service'
}

export type UserRole = 'buyer' | 'seller';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Shop {
  id: string;
  profile_id: string; // Owner
  shop_name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  wallet_balance: number;
  verified: boolean;
}

export interface Product {
  id: string;
  shop_id: string;
  title: string;
  description: string;
  price: number;
  
  // The Hybrid Logic
  product_type: ProductType;
  affiliate_link?: string; // If present, it's affiliate. If null, it's direct.
  
  images: string[];
  video_url?: string;
  category: string;
  
  // Stats for the marketplace view
  rating: number;
  reviewCount: number;
}

export interface AnalyticsMetrics {
  product_id: string;
  views: number;
  clicks: number;
  sales_count: number;
  revenue: number; // For direct sales
}

export interface FilterState {
  query: string;
  type: ProductType | 'all';
  category: string | 'all';
}