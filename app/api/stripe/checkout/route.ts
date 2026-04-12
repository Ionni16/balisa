import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { items, customer }: { items: CartItem[]; customer: any } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: `Colore: ${item.color}`,
          images: item.product.images.slice(0, 1),
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: customer.email,
      shipping_address_collection: {
        allowed_countries: ["IT", "FR", "DE", "ES", "AT", "CH", "BE", "NL"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 500, currency: "eur" },
            display_name: "Spedizione standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      metadata: {
        customer_name: customer.name,
        customer_address: JSON.stringify({
          line1: customer.line1,
          city: customer.city,
          postal_code: customer.postal_code,
          country: "IT",
        }),
        items: JSON.stringify(
          items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            quantity: i.quantity,
            color: i.color,
            price: i.product.price,
          }))
        ),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
