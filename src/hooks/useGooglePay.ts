// 'use client'

// import { useState, useEffect } from 'react';


// export const googlePayConfig = {
//     environment: 'TEST', // Change to 'PRODUCTION' for live
//     apiVersion: 2,
//     apiVersionMinor: 0,
//     merchantInfo: {
//         merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
//         merchantName: process.env.BRAND_NAME
//     },
//     allowedPaymentMethods: [{
//         type: 'CARD',
//         parameters: {
//             allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
//             allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
//         },
//         tokenizationSpecification: {
//             type: 'PAYMENT_GATEWAY',
//             parameters: {
//                 gateway: 'example', // Replace with your payment gateway
//                 gatewayMerchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID
//             }
//         }
//     }]
// };

// export const isGooglePayAvailable = async (): Promise<boolean> => {
//     if (typeof window === 'undefined') return false;

//     try {
//         // @ts-expect-error google-pay-client
//         const paymentsClient = new google.payments.api.PaymentsClient({
//             environment: googlePayConfig.environment
//         });

//         const isReadyToPayRequest = {
//             apiVersion: googlePayConfig.apiVersion,
//             apiVersionMinor: googlePayConfig.apiVersionMinor,
//             allowedPaymentMethods: googlePayConfig.allowedPaymentMethods
//         };

//         const response = await paymentsClient.isReadyToPay(isReadyToPayRequest);
//         return response.result;
//     } catch (err) {
//         console.error('Google Pay availability check failed:', err);
//         return false;
//     }
// };
// export function useGooglePay() {
//     const [isAvailable, setIsAvailable] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<Error | null>(null);

//     useEffect(() => {
//         const checkAvailability = async () => {
//             try {
//                 await loadGooglePayScript();
//                 const available = await isGooglePayAvailable();
//                 setIsAvailable(available);
//             } catch (err) {
//                 setError(err instanceof Error ? err : new Error('Failed to load Google Pay'));
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         checkAvailability();
//     }, []);

//     return { isAvailable, isLoading, error };
// }

// const loadGooglePayScript = () => {
//     return new Promise<void>((resolve, reject) => {
//         if (document.querySelector('script[src*="pay.google.com"]')) {
//             resolve();
//             return;
//         }
//         const script = document.createElement('script');
//         script.src = 'https://pay.google.com/gp/p/js/pay.js';
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error('Failed to load Google Pay script'));
//         document.body.appendChild(script);
//     });
// }; 
export { }