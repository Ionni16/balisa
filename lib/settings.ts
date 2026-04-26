import { supabase } from './supabase';
import { SiteSettings } from './types';
export const DEFAULT_SETTINGS: SiteSettings = {
  hero_eyebrow: 'Handmade statement bags from Italy',
  hero_title: 'Colourful pieces for elevated summer dressing.',
  hero_subtitle: 'OKKA creates limited-run crochet bags with sculptural texture, vivid colour and a made-by-hand finish.',
  hero_image: '',
  announcement: 'Worldwide shipping — handmade in limited quantities',
  instagram_url: 'https://instagram.com/okka.boutique',
  instagram_handle: '@okka.boutique',
  contact_email: 'hello@okkaboutique.com',
  about_title: 'Creativity, texture and fearless colour.',
  about_text: 'Each OKKA bag is made in small batches with a focus on expressive colour, tactile yarns and distinctive silhouettes. No two pieces are exactly the same.',
  shipping_text: 'Worldwide shipping available. Orders are prepared within 2–5 business days unless marked as made-to-order.',
  returns_text: 'Returns are accepted within 14 days for unused items in original condition. Custom pieces are final sale.'
};
export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  return { ...DEFAULT_SETTINGS, ...(data || {}) } as SiteSettings;
}
