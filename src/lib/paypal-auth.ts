import { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from './paypal-config';

export async function getPayPalAccessToken(): Promise<string> {
    try {
        const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!authResponse.ok) {
            const errorData = await authResponse.json();
            console.error('PayPal auth error:', errorData);
            throw new Error('Failed to obtain PayPal access token');
        }

        const authData = await authResponse.json();
        return authData.access_token;
    } catch (error) {
        console.error('PayPal authentication error:', error);
        throw new Error('PayPal authentication failed');
    }
} 