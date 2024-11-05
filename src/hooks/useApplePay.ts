'use client'

import { useState, useCallback } from 'react';

export const useApplePay = (amount: number, initialOrderId: string) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startApplePaySession = useCallback(async (orderId: string) => {
        setIsProcessing(true);
        setError(null);

        try {
            const paypal = (window as any).paypal;
            const applepay = paypal.Applepay();
            
            const {
                isEligible,
                countryCode,
                currencyCode,
                merchantCapabilities,
                supportedNetworks,
            } = await applepay.config();

            if (!isEligible) {
                throw new Error("Apple Pay is not eligible");
            }

            const session = new (window as any).ApplePaySession(3, {
                countryCode,
                currencyCode: 'USD',
                merchantCapabilities,
                supportedNetworks,
                total: {
                    label: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Your Store',
                    amount: amount.toString(),
                    type: 'final'
                }
            });

            session.onvalidatemerchant = async (event: any) => {
                try {
                    const validationResponse = await applepay.validateMerchant({
                        validationUrl: event.validationURL,
                        displayName: process.env.NEXT_PUBLIC_BUSINESS_NAME
                    });
                    session.completeMerchantValidation(validationResponse);
                } catch (err) {
                    setError('Failed to validate merchant');
                    session.abort();
                }
            };

            session.onpaymentauthorized = async (event: any) => {
                try {
                    const response = await fetch(`/api/checkout/capture-order/${orderId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            payment: event.payment,
                            paymentMethod: 'applepay'
                        })
                    });

                    if (response.ok) {
                        session.completePayment({
                            status: (window as any).ApplePaySession.STATUS_SUCCESS
                        });
                        window.location.href = '/success';
                    } else {
                        session.completePayment({
                            status: (window as any).ApplePaySession.STATUS_FAILURE
                        });
                        setError('Payment failed');
                    }
                } catch (err) {
                    session.completePayment({
                        status: (window as any).ApplePaySession.STATUS_FAILURE
                    });
                    setError('Payment processing failed');
                }
            };

            session.begin();
        } catch (err: any) {
            setError(err.message || 'Failed to initialize Apple Pay');
        } finally {
            setIsProcessing(false);
        }
    }, [amount]);

    return {
        startApplePaySession,
        isProcessing,
        error
    };
}; 