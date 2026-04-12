import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const items = JSON.parse(session.metadata?.items || "[]");
      const customerAddress = JSON.parse(session.metadata?.customer_address || "{}");
      const shippingAddress = session.shipping_details?.address;

      const address = shippingAddress
        ? {
            line1: shippingAddress.line1 || customerAddress.line1,
            city: shippingAddress.city || customerAddress.city,
            postal_code: shippingAddress.postal_code || customerAddress.postal_code,
            country: shippingAddress.country || "IT",
          }
        : customerAddress;

      const { error } = await supabaseAdmin.from("orders").insert({
        stripe_session_id: session.id,
        customer_name: session.metadata?.customer_name || session.customer_details?.name || "",
        customer_email: session.customer_email || session.customer_details?.email || "",
        customer_address: address,
        items,
        total: (session.amount_total || 0) / 100,
        status: "paid",
      });

      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        for (const item of items) {
          const { data: product } = await supabaseAdmin
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (product && product.stock > 0) {
            await supabaseAdmin
              .from("products")
              .update({ stock: Math.max(0, product.stock - item.quantity) })
              .eq("id", item.product_id);
          }
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
