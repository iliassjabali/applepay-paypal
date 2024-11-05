import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal-auth";
import { PAYPAL_API_BASE } from "@/lib/paypal-config";

export async function POST(req: Request) {
    try {
        const accessToken = await getPayPalAccessToken();
        
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "1.00", // Replace with your actual amount
                        },
                    },
                ],
            }),
        });
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
} 