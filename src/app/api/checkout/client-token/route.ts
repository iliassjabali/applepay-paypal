import { NextResponse } from 'next/server';
import { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from '@/lib/paypal-config';

export async function GET() {
  try {
    // Get access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const { access_token } = await tokenResponse.json();

    // Generate client token
    const response = await fetch(`${PAYPAL_API_BASE}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const { client_token } = await response.json();

    return NextResponse.json({ clientToken: client_token });
  } catch (error) {
    console.error('Error generating client token:', error);
    return NextResponse.json({ error: 'Failed to generate client token' }, { status: 500 });
  }
}