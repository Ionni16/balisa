import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type AnySupabaseClient = SupabaseClient<any, "public", any>;

function buildClient(key?: string): AnySupabaseClient | null {
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key);
}

export const hasSupabasePublicEnv = Boolean(supabaseUrl && supabaseAnonKey);
export const hasSupabaseAdminEnv = Boolean(supabaseUrl && supabaseServiceKey);

export const supabase = buildClient(supabaseAnonKey);
export const supabaseAdmin = buildClient(supabaseServiceKey);

export function getSupabaseErrorMessage() {
  return "Supabase non configurato. Controlla .env.local e inserisci NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY.";
}

export function requireSupabaseAdmin(): AnySupabaseClient {
  if (!supabaseAdmin) {
    throw new Error(getSupabaseErrorMessage());
  }
  return supabaseAdmin;
}

export async function uploadProductImage(file: File): Promise<string> {
  const admin = requireSupabaseAdmin();
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await admin.storage
    .from("products")
    .upload(filename, file, { contentType: file.type });
  if (error) throw error;
  const { data } = admin.storage.from("products").getPublicUrl(filename);
  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const admin = requireSupabaseAdmin();
  const filename = url.split("/").pop()!;
  await admin.storage.from("products").remove([filename]);
}
