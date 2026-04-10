import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper: upload image to Supabase Storage
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(filename, file, { contentType: file.type });

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(filename);

  return data.publicUrl;
}

// Helper: delete image from Supabase Storage
export async function deleteProductImage(url: string): Promise<void> {
  const filename = url.split("/").pop()!;
  await supabaseAdmin.storage.from("products").remove([filename]);
}
