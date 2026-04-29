import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, getSupabaseErrorMessage } from "@/lib/supabase";

function slugify(text: string): string {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function requireAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_SECRET_KEY;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function cleanProductPayload(body: Record<string, unknown>, isCreate = false) {
  const out: Record<string, unknown> = {};

  if (typeof body.name === "string") out.name = body.name.trim();
  if (typeof body.description === "string") out.description = body.description.trim();
  if (typeof body.category === "string") out.category = body.category.trim();
  if (typeof body.material === "string") out.material = body.material.trim();
  if (typeof body.dimensions === "string") out.dimensions = body.dimensions.trim();
  if (typeof body.care === "string") out.care = body.care.trim();
  if (typeof body.stripe_price_id === "string") out.stripe_price_id = body.stripe_price_id.trim();

  if ("images" in body) out.images = normalizeStringArray(body.images);
  if ("colors" in body) out.colors = normalizeStringArray(body.colors);
  if ("featured" in body) out.featured = Boolean(body.featured);

  if ("price" in body) {
    const price = Number(body.price);
    if (Number.isFinite(price) && price >= 0) out.price = price;
  }

  if ("compare_at_price" in body) {
    const compareAt = body.compare_at_price === null || body.compare_at_price === "" ? null : Number(body.compare_at_price);
    out.compare_at_price = compareAt === null || (Number.isFinite(compareAt) && compareAt >= 0) ? compareAt : null;
  }

  if ("stock" in body) {
    const stock = Number(body.stock);
    if (Number.isFinite(stock)) out.stock = Math.max(0, Math.floor(stock));
  }

  if (isCreate) {
    out.description ??= "";
    out.images ??= [];
    out.colors ??= [];
    out.category ??= "clutch";
    out.stock ??= 1;
    out.featured ??= false;
  }

  return out;
}

function revalidateProductViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
}

async function uniqueSlug(name: string, currentId?: string) {
  if (!supabaseAdmin) throw new Error(getSupabaseErrorMessage());

  const base = slugify(name) || "product";
  let candidate = base;
  let suffix = 2;

  while (true) {
    let query = supabaseAdmin.from("products").select("id").eq("slug", candidate).limit(1);
    if (currentId) query = query.neq("id", currentId);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function GET() {
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data || [], { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const body = await req.json();
  const updates = cleanProductPayload(body, true);

  if (!updates.name) return jsonError("Product name is required");
  if (updates.price === undefined) return jsonError("Product price is required");

  const slug = await uniqueSlug(String(updates.name));
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ ...updates, slug })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  revalidateProductViews(slug);
  return NextResponse.json(data, { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return jsonError("Missing product id");

  const updates = cleanProductPayload(body);
  if (updates.name) updates.slug = await uniqueSlug(String(updates.name), id);

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  revalidateProductViews(data?.slug);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return jsonError("Missing id");

  const { data: existing } = await supabaseAdmin.from("products").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) return jsonError(error.message, 500);
  revalidateProductViews(existing?.slug);
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
