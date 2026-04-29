export interface Product{
  id:string;
  name:string;
  slug:string;
  description:string;
  price:number;
  compare_at_price?:number|null;
  images:string[];
  colors:string[];
  category:string;
  stock:number;
  featured:boolean;
  material?:string;
  dimensions?:string;
  care?:string;
  stripe_price_id?:string;
  created_at:string;
}

export interface SiteSettings{
  id?:string;
  brand_name:string;
  logo_url:string;
  favicon_url:string;

  announcement:string;
  announcement_url:string;

  hero_eyebrow:string;
  hero_title:string;
  hero_subtitle:string;
  hero_image:string;
  hero_image_mobile:string;
  hero_button_label:string;
  hero_button_url:string;
  secondary_button_label:string;
  secondary_button_url:string;

  best_sellers_title:string;
  best_sellers_subtitle:string;

  purpose_eyebrow:string;
  purpose_title:string;
  purpose_text:string;
  purpose_image_left:string;
  purpose_image_right:string;
  purpose_button_label:string;
  purpose_button_url:string;

  about_title:string;
  about_text:string;
  shipping_text:string;
  returns_text:string;
  care_text:string;
  contact_email:string;
  instagram_url:string;
  instagram_handle:string;
  instagram_feed_mode:string;
  instagram_access_token:string;
  instagram_post_image_1:string;
  instagram_post_url_1:string;
  instagram_post_image_2:string;
  instagram_post_url_2:string;
  instagram_post_image_3:string;
  instagram_post_url_3:string;
  instagram_post_image_4:string;
  instagram_post_url_4:string;
  tiktok_url:string;
  pinterest_url:string;
  newsletter_title:string;
  newsletter_text:string;

  announcement_bg_color:string;
  announcement_text_color:string;
  header_bg_color:string;
  page_bg_color:string;
  product_card_bg_color:string;
  footer_bg_color:string;
  footer_text_color:string;
  button_bg_color:string;
  button_text_color:string;
  text_color:string;
  muted_text_color:string;
  hero_overlay_opacity:string;

  updated_at?:string;
}

export interface CartItem{
  product:Product;
  quantity:number;
  color:string;
}

export interface Order{
  id:string;
  stripe_session_id:string;
  customer_name:string;
  customer_email:string;
  customer_address:any;
  items:any[];
  total:number;
  status:'pending'|'paid'|'shipped'|'delivered'|'cancelled';
  created_at:string;
}
