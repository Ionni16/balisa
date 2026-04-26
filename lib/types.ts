export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  colors: string[];
  category: string;
  stock: number;
  featured: boolean;
  material?: string;
  dimensions?: string;
  care?: string;
  stripe_price_id?: string;
  created_at: string;
}
export interface SiteSettings {
  id?: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  announcement: string;
  instagram_url: string;
  instagram_handle: string;
  contact_email: string;
  about_title: string;
  about_text: string;
  shipping_text: string;
  returns_text: string;
}
export interface CartItem { product: Product; quantity: number; color: string; }
export interface Order { id: string; stripe_session_id: string; customer_name: string; customer_email: string; customer_address: any; items: any[]; total: number; status: 'pending'|'paid'|'shipped'|'delivered'|'cancelled'; created_at: string; }
