"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutForm } from '@/components/checkout-form'
import Script from 'next/script'
import { PAYPAL_CONFIG } from '@/lib/paypal-config';
import { Suspense } from 'react';
import { useClientToken } from '@/hooks/usePayPal';
// We'll make this server component to fetch the client token

export default function CheckoutPage() {
  const { data: clientToken } = useClientToken()
  if (!clientToken) {
    return <div>Loading...</div>
  }
  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?components=googlepay,applepay&client-id=${PAYPAL_CONFIG.clientId}`}
        data-client-token={clientToken}
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Secure Checkout</CardTitle>
            <CardDescription>Enter the amount and proceed to payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <CheckoutForm
                clientToken={clientToken}
                amount={1}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}