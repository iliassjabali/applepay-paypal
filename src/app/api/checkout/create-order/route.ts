import { NextResponse } from 'next/server'
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE } from '@/lib/paypal-config'


async function getAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })
    const data = await response.json()
    return data.access_token
}

export async function POST(request: Request) {
    try {
        const { amount } = await request.json()
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: amount.toString()
                    }
                }]
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('PayPal API Error:', data)
            return NextResponse.json(
                { message: data.message || 'Failed to create PayPal order' },
                { status: response.status }
            )
        }

        return NextResponse.json({ orderId: data.id })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
} 