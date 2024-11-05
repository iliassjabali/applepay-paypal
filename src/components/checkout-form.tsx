'use client'

import { useState, useEffect, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons, PayPalHostedField, PayPalHostedFieldsProvider, type PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { PAYPAL_CONFIG } from '@/lib/paypal-config'
import { useCreateOrder, useCaptureOrder } from '@/hooks/usePayPal'
import { useRouter } from 'next/navigation'
import { useApplePay } from '@/hooks/useApplePay'
import { isApplePayAvailable } from '@/lib/apple-pay-config'
// import { useGooglePay } from '@/hooks/useGooglePay'
import { Button } from './ui/button'
import Image from 'next/image'

interface PayPalHostedFieldsInstance {
    submit: (options?: {
        contingencies?: string[];
        orderID?: string;
    }) => Promise<{
        liabilityShifted: boolean;
        liabilityShiftPossible: boolean;
    }>;
}

export function CheckoutForm({ amount, clientToken }: {
    amount: number,
    clientToken: string
}) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [showGooglePay, setShowGooglePay] = useState(false)
    const hostedFieldsInstance = useRef<PayPalHostedFieldsInstance | null>(null)
    const { mutateAsync: createOrder } = useCreateOrder()
    const { mutateAsync: captureOrder } = useCaptureOrder()

    const applePay = useApplePay(amount, '')
    // const googlePay = useGooglePay(amount, '')

    const showApplePay = isApplePayAvailable()

    const handleHostedFieldsSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            if (!hostedFieldsInstance.current) {
                throw new Error('Hosted fields are not ready')
            }
            console.log("hostedFieldsInstance\t", hostedFieldsInstance.current)
            // Create order first
            const { orderId } = await createOrder(amount)
            console.log("orderId\t", orderId)
            // Submit the hosted fields data with the order ID
            const { liabilityShifted, liabilityShiftPossible } = await hostedFieldsInstance.current.submit({
                contingencies: ['3D_SECURE'],
                orderID: orderId
            })

            // If 3D Secure verification was successful or not required
            if (liabilityShifted || !liabilityShiftPossible) {
                await captureOrder(orderId)
                router.push('/success?orderId=' + orderId)
            } else {
                setError('3D Secure verification failed. Please try again.')
            }
        } catch (err) {
            console.error(err)
            setError('Payment processing failed. Please try again.')
        }
    }

    const handleApplePay = async () => {
        try {
            // Create order first
            const { orderId } = await createOrder(amount)
            await applePay.startApplePaySession(orderId)
        } catch (error) {
            console.error('Apple Pay error:', error)
            setError('Apple Pay payment failed. Please try again.')
        }
    }

    // const handleGooglePay = async () => {
    //     try {
    //         // Create order first
    //         const { orderId } = await createOrder(amount)
    //         await googlePay.startGooglePaySession(orderId)
    //     } catch (error) {
    //         console.error('Google Pay error:', error)
    //         setError('Google Pay payment failed. Please try again.')
    //     }
    // }

    const createOrderHandler: PayPalButtonsComponentProps["createOrder"] = async () => {
        try {
            const response = await fetch("/api/checkout/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const order = await response.json();
            console.log("order\t", order)
            return order.id;
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const onApproveHandler: PayPalButtonsComponentProps["onApprove"] = async (data: any) => {
        try {
            const response = await fetch("/api/checkout/capture", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                }),
            });
            const orderData = await response.json();
            // Handle successful payment
            console.log("Payment successful!", orderData);
            router.push('/success?orderId=' + orderData.id)
        } catch (error) {
            console.error("Error capturing order:", error);
        }
    };

    return (
        <>
            {error ? (
                <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg shadow-md text-red-600">
                    <p className="whitespace-pre-wrap">{error}</p>
                </div>
            ) : (
                <PayPalScriptProvider
                    options={{
                        clientId: PAYPAL_CONFIG.clientId,
                        currency: PAYPAL_CONFIG.currency,
                        intent: PAYPAL_CONFIG.intent,
                        dataClientToken: clientToken,
                        // components: 'buttons,hosted-fields',
                    }}
                // onError={(err) => {
                //     console.error('PayPal script failed to load:', err);
                //     setError('Failed to load payment system. Please try again later.');
                // }}
                >
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
                        {/* Credit Card Fields */}
                        {/* <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Pay with Credit Card</h2>
                            <PayPalHostedFieldsProvider
                                createOrder={async () => {
                                    const { orderId } = await createOrder(amount)
                                    console.log("orderId\t", orderId)
                                    return orderId
                                }}
                                styles={{
                                    input: {
                                        'font-size': '16px',
                                        'font-family': 'Arial',
                                        color: '#3a3a3a',
                                        padding: '10px',
                                    },
                                    ':focus': {
                                        'border-color': '#0070ba',
                                    },
                                }}
                            >
                                <form onSubmit={handleHostedFieldsSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="card-number" className="block text-sm font-medium mb-2">
                                            Card Number
                                        </label>
                                        <PayPalHostedField
                                            id="card-number"
                                            className="w-full p-3 border rounded"
                                            hostedFieldType="number"
                                            options={{
                                                selector: '#card-number',
                                                placeholder: '4111 1111 1111 1111',
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiration-date" className="block text-sm font-medium mb-2">
                                                Expiration Date
                                            </label>
                                            <PayPalHostedField
                                                id="expiration-date"
                                                className="w-full p-3 border rounded"
                                                hostedFieldType="expirationDate"
                                                options={{
                                                    selector: '#expiration-date',
                                                    placeholder: 'MM/YY',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                                                CVV
                                            </label>
                                            <PayPalHostedField
                                                id="cvv"
                                                className="w-full p-3 border rounded"
                                                hostedFieldType="cvv"
                                                options={{
                                                    selector: '#cvv',
                                                    placeholder: '123',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!hostedFieldsInstance.current}
                                    >
                                        Pay ${amount}
                                    </Button>
                                </form>
                            </PayPalHostedFieldsProvider>
                        </div> */}

                        {/* PayPal Button */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Pay with PayPal</h2>
                            <PayPalButtons
                                style={{ layout: "vertical" }}
                                createOrder={createOrderHandler}
                                onApprove={onApproveHandler}
                                onError={(err) => {
                                    setError('PayPal Checkout failed. Please try again.')
                                    console.error('PayPal Checkout Error:', err)
                                }}
                            />
                        </div>

                        {/* Digital Wallets */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <h2 className="text-lg font-semibold mb-4">Digital Wallets</h2>

                            {showApplePay ? (
                                <div>
                                    <button
                                        onClick={handleApplePay}
                                        disabled={applePay.isProcessing}
                                        className="apple-pay-button w-full h-12 rounded-lg"
                                        style={{
                                            '--apple-pay-button-width': '100%',
                                            '--apple-pay-button-height': '48px',
                                        } as React.CSSProperties}
                                    />
                                    {applePay.error && <div className="text-red-500 text-sm mt-2">{applePay.error}</div>}
                                </div>
                            ) : null}
                            {/*showGooglePay ? (
                                <div>
                                    <button
                                        onClick={handleGooglePay}
                                        disabled={googlePay.isProcessing}
                                        className="w-full h-12 bg-black text-white rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Image
                                            src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg"
                                            alt="Google Pay"
                                            width={48}
                                            height={48}
                                            className="h-6"
                                        />
                                    </button>
                                    {googlePay.error && <div className="text-red-500 text-sm mt-2">{googlePay.error}</div>}
                                </div>
                            ) : null */}
                        </div>
                    </div>
                </PayPalScriptProvider>
            )}
        </>
    )
}