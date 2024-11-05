import { NextResponse } from 'next/server'
import { PAYPAL_API_BASE } from '@/lib/paypal-config'
import { getPayPalAccessToken } from '@/lib/paypal-auth'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json(
                { error: 'Missing orderId' },
                { status: 400 }
            );
        }

        const accessToken = await getPayPalAccessToken();

        // Capture the order with the fresh access token
        const response = await fetch(
            `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'PayPal-Request-Id': orderId, // Idempotency key
                },
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Capture error:', data)
            throw new Error(data.details?.[0]?.description || 'Failed to capture order')
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Capture order error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to capture order' },
            { status: 500 }
        )
    }
} 