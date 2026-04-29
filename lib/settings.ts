import { supabase } from './supabase';
import { SiteSettings } from './types';

export const DEFAULT_SETTINGS:SiteSettings={
  brand_name:'Balisa',
  logo_url:'/logo_balisa_Senza.png',
  favicon_url:'',

  announcement:'Ready-Made bags | Only 1 available for each',
  announcement_url:'/shop',

  hero_eyebrow:'',
  hero_title:'THE summer bags',
  hero_subtitle:'',
  hero_image:'',
  hero_image_mobile:'',
  hero_button_label:'Shop now',
  hero_button_url:'/shop',
  secondary_button_label:'Custom orders',
  secondary_button_url:'/#contact',

  best_sellers_title:'Best sellers',
  best_sellers_subtitle:'',

  purpose_eyebrow:'',
  purpose_title:'Made with purpose',
  purpose_text:'Discover the beauty of sustainable fashion with our handmade crochet bags. Each bag is made to order, reducing waste and embracing slow fashion. Designed for everyday style.',
  purpose_image_left:'',
  purpose_image_right:'',
  purpose_button_label:'Contact us',
  purpose_button_url:'mailto:hello@balisa.it',

  about_title:'Handmade crochet bags designed for everyday style.',
  about_text:'Balisa creates small-batch crochet bags with soft shapes, expressive colours and a clean handmade finish. Each piece is crafted to feel personal, tactile and made to last.',
  shipping_text:'Shipping is calculated at check-out. Ready-made pieces are prepared within 2–5 business days. Made-to-order timelines are confirmed before production.',
  returns_text:'Returns are accepted within 14 days for unused ready-made items in original condition. Custom pieces are final sale.',
  care_text:'Hand wash in cold water with mild soap and lay flat to dry.',
  contact_email:'hello@balisa.it',
  instagram_url:'https://instagram.com/balisa',
  instagram_handle:'@balisa',
  tiktok_url:'',
  pinterest_url:'',
  newsletter_title:'Join the Balisa list',
  newsletter_text:'Be first to know about limited drops, custom openings and new colour stories.',

  announcement_bg_color:'#f3b8c1',
  announcement_text_color:'#ffffff',
  header_bg_color:'#ffffff',
  page_bg_color:'#ffffff',
  product_card_bg_color:'#eeeeee',
  footer_bg_color:'#111111',
  footer_text_color:'#ffffff',
  button_bg_color:'#191919',
  button_text_color:'#ffffff',
  text_color:'#191919',
  muted_text_color:'#666666',
  hero_overlay_opacity:'0.14'
};

export async function getSiteSettings():Promise<SiteSettings>{
  if(!supabase) return DEFAULT_SETTINGS;
  try {
    const {data}=await supabase.from('site_settings').select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle();
    return {...DEFAULT_SETTINGS,...(data||{})} as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
