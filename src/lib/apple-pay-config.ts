
export const applePayConfig = {
    merchantIdentifier: process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID!,
    supportedNetworks: ['visa', 'masterCard', 'amex'],
    merchantCapabilities: ['supports3DS'],
    countryCode: 'US',
    currencyCode: 'USD'
};
declare global {
    interface Window {
        ApplePaySession: unknown
    }
}
export const isApplePayAvailable = () => {
    if (typeof window === 'undefined') return false;
    // @ts-expect-error ApplePaySession is not defined in the global scope
    return window.ApplePaySession && window.ApplePaySession.canMakePayments();
}; 