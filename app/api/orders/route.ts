import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getSupabaseErrorMessage } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const STATUSES: Order["status"][] = ["pending", "paid", "shipped", "delivered", "cancelled"];

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function requireAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_SECRET_KEY;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data || [], { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const { id, status } = await req.json();
  if (typeof id !== "string") return jsonError("Missing order id");
  if (!STATUSES.includes(status)) return jsonError("Invalid order status");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
