import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/types";

const allowedShippingCountries = [
  "IT",
  "FR",
  "DE",
  "ES",
  "AT",
  "BE",
  "NL",
  "LU",
  "PT",
  "IE",
  "DK",
  "SE",
  "FI",
  "PL",
  "CZ",
  "SK",
  "SI",
  "HR",
  "HU",
  "RO",
  "BG",
  "GR",
  "EE",
  "LV",
  "LT",
  "MT",
  "CY",
  "CH",
  "NO",
] as const;

type ShippingCountry = (typeof allowedShippingCountries)[number];

function isAllowedShippingCountry(country: string): country is ShippingCountry {
  return allowedShippingCountries.includes(country as ShippingCountry);
}

export async function POST(req: NextRequest) {
  try {
    const { items, customer }: { items: CartItem[]; customer: any } =
      await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customer?.email) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.balisa.it";

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.product.price || 0) * Number(item.quantity || 0);
    }, 0);

    const requestedCountry = customer?.country || "IT";

    if (!isAllowedShippingCountry(requestedCountry)) {
      return NextResponse.json(
        { error: "Shipping country is not supported" },
        { status: 400 }
      );
    }

    const customerCountry = requestedCountry;
    const isItaly = customerCountry === "IT";

    // Shipping rules:
    // Italy: €4.99
    // Italy over €79: free
    // Europe: €11.99
    // Europe over €79: still €11.99
    const shippingAmount = isItaly ? (subtotal >= 79 ? 0 : 499) : 1199;

    const shippingName = isItaly
      ? shippingAmount === 0
        ? "Free shipping"
        : "Standard shipping Italy"
      : "Standard shipping Europe";

    const minDeliveryDays = isItaly ? 3 : 5;
    const maxDeliveryDays = isItaly ? 5 : 10;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: `Color: ${item.color}`,
          images: item.product.images?.slice(0, 1) || [],
        },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",

      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,

      customer_email: customer.email,

      shipping_address_collection: {
        allowed_countries: [...allowedShippingCountries],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingAmount,
              currency: "eur",
            },
            display_name: shippingName,
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: minDeliveryDays,
              },
              maximum: {
                unit: "business_day",
                value: maxDeliveryDays,
              },
            },
          },
        },
      ],

      metadata: {
        customer_name: customer.name || "",
        customer_address: JSON.stringify({
          line1: customer.line1 || "",
          city: customer.city || "",
          postal_code: customer.postal_code || "",
          country: customerCountry,
        }),
        shipping_country: customerCountry,
        shipping_amount: String(shippingAmount),
        shipping_name: shippingName,
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