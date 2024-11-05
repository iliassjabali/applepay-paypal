import { type ReactPayPalScriptOptions } from "@paypal/react-paypal-js"

export const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

export const PAYPAL_CONFIG = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    dataClientToken: undefined,
    components: 'buttons,hosted-fields',
    disableFunding: 'paylater,venmo',
    enableFunding: 'card',
    dataSdkIntegrationSource: 'integrationbuilder_ac',
} satisfies ReactPayPalScriptOptions