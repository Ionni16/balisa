export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in euros (e.g. 89.00)
  images: string[]; // array of Supabase storage URLs
  colors: string[]; // available colors
  category: string; // "tote" | "mini" | "clutch" | "crossbody"
  stock: number;
  featured: boolean;
  stripe_price_id?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    color: string;
    price: number;
  }[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}
