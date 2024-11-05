import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal-auth";
import {PAYPAL_API_BASE} from "@/lib/paypal-config" 
export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error capturing order:", error);
    return NextResponse.json({ error: "Error capturing order" }, { status: 500 });
  }
}