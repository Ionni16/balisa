import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => String(item).trim()).filter(Boolean)));
}

function numberOrDefault(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeProductPayload(body: Record<string, unknown>, mode: 'create' | 'update') {
  const payload: Record<string, unknown> = {};

  if (typeof body.name === 'string') {
    payload.name = body.name.trim();
    payload.slug = slugify(body.name);
  }

  if (typeof body.description === 'string') payload.description = body.description.trim();
  if ('price' in body) payload.price = numberOrDefault(body.price, 0);
  if ('compare_at_price' in body) payload.compare_at_price = nullableNumber(body.compare_at_price);
  if ('images' in body) payload.images = stringArray(body.images);
  if ('colors' in body) payload.colors = stringArray(body.colors);
  if (typeof body.category === 'string') payload.category = body.category.trim() || 'mini';
  if ('stock' in body) payload.stock = Math.max(0, Math.trunc(numberOrDefault(body.stock, 0)));
  if ('featured' in body) payload.featured = Boolean(body.featured);
  if (typeof body.material === 'string') payload.material = body.material.trim();
  if (typeof body.dimensions === 'string') payload.dimensions = body.dimensions.trim();
  if (typeof body.care === 'string') payload.care = body.care.trim();
  if (typeof body.stripe_price_id === 'string') payload.stripe_price_id = body.stripe_price_id.trim();

  if (mode === 'create') {
    payload.name = String(payload.name || '').trim();
    payload.description = String(payload.description || '').trim();
    payload.slug = slugify(String(payload.name));
    payload.price = numberOrDefault(payload.price, 0);
    payload.images = stringArray(payload.images);
    payload.colors = stringArray(payload.colors);
    payload.category = String(payload.category || 'mini');
    payload.stock = Math.max(0, Math.trunc(numberOrDefault(payload.stock, 0)));
    payload.featured = Boolean(payload.featured);
    payload.material = String(payload.material || '');
    payload.dimensions = String(payload.dimensions || '');
    payload.care = String(payload.care || '');
  }

  return payload;
}

function revalidateProductPages(product?: { id?: string; slug?: string | null }) {
  revalidatePath('/');
  revalidatePath('/shop');
  if (product?.id) revalidatePath(`/product/${product.id}`);
  if (product?.slug) revalidatePath(`/product/${product.slug}`);
}

function unauthorized(req: NextRequest) {
  return req.headers.get('x-admin-key') !== process.env.ADMIN_SECRET_KEY;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  if (unauthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const payload = sanitizeProductPayload(body, 'create');

  if (!payload.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateProductPages(data);
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (unauthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

  const payload = sanitizeProductPayload(body, 'update');
  if (Object.keys(payload).length === 0) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateProductPages(data);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (unauthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, slug')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateProductPages(product || undefined);
  return NextResponse.json({ success: true });
}
