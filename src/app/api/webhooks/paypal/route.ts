import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PayPalWebhookEventSchema, PayPalWebhookEvent } from "@/lib/paypal-types";
import { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "@/lib/paypal-config";

// Add webhook ID as constant
const WEBHOOK_ID = "2CC54859VS734345R";

async function verifyPayPalWebhook(
  body: string,
  transmissionId: string,
  transmissionSig: string,
  transmissionTime: string,
): Promise<boolean> {
  try {
    // Get webhook verification token from PayPal
    const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: 'https://api.sandbox.paypal.com/v1/notifications/certs/CERT-360caa42-fca2a594-a5cafa77', // Use live URL in production
        auth_algo: 'SHA256withRSA',
        transmission_sig: transmissionSig,
        webhook_id: WEBHOOK_ID,
        webhook_event: JSON.parse(body)
      })
    });

    const verificationData = await verifyResponse.json();
    return verificationData.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await  headers();
    
    const paypalSignature = headersList.get("paypal-transmission-sig");
    const paypalTransmissionId = headersList.get("paypal-transmission-id");
    const paypalTransmissionTime = headersList.get("paypal-transmission-time");

    if (!paypalSignature || !paypalTransmissionId || !paypalTransmissionTime) {
      return new NextResponse("Missing PayPal webhook headers", { status: 400 });
    }

    // Verify webhook authenticity
    const isValid = await verifyPayPalWebhook(
      body,
      paypalTransmissionId,
      paypalSignature,
      paypalTransmissionTime,
    );

    if (!isValid) {
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    const event = PayPalWebhookEventSchema.parse(JSON.parse(body));

    // Handle different webhook events
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        // Handle successful payment
        await handlePaymentCompleted(event);
        break;
      case "PAYMENT.CAPTURE.DENIED":
        // Handle denied payment
        await handlePaymentDenied(event);
        break;
      // Add more event types as needed
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook processing failed", { status: 400 });
  }
}

async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  // Implement payment completion logic
  // e.g., update database, send confirmation email, etc.
  console.log("Payment completed:", event.resource.id);
}

async function handlePaymentDenied(event: PayPalWebhookEvent) {
  // Implement payment denial logic
  console.log("Payment denied:", event.resource.id);
} 