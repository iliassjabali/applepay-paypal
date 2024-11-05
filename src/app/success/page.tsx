import Link from 'next/link'
import { PAYPAL_API_BASE } from '@/lib/paypal-config'
import { PayPalOrderSchema } from '@/lib/paypal-types'
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from '@/lib/paypal-config'

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<Record<string, string>>
}) {
    const { orderId } = await searchParams;
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
        headers: {
            'Authorization': `Basic ${Buffer.from(
                `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/json'
        }
    });

    const rawData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }

    // Validate the PayPal order data
    const data = PayPalOrderSchema.parse(rawData);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h2 className="text-2xl font-semibold text-success">
                Payment Successful!
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
                Thank you for your purchase, {data.payment_source.paypal.name.given_name}!
                Your payment was processed successfully.
            </p>
            <div className="bg-muted p-4 rounded-lg">
                <p>Order ID: {data.id}</p>
                <p>Status: {data.status}</p>
                <p>Amount: {data.purchase_units[0].amount.value} {data.purchase_units[0].amount.currency_code}</p>
            </div>
            <div className="flex gap-4">
                <Link href="/" className="hover:underline">
                    Return Home
                </Link>
                <Link href="/orders" className="hover:underline">
                    View Orders
                </Link>
            </div>
        </div>
    )
}