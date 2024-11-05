import { useMutation, useQuery } from '@tanstack/react-query';

export function useClientToken() {
  return useQuery({
    queryKey: ['clientToken'],
    queryFn: async () => {
      const response = await fetch('/api/checkout/client-token');
      if (!response.ok) {
        throw new Error('Failed to get client token');
      }
      const data = await response.json();
      return data.clientToken;
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      console.log("create order response\t", response)
      if (!response.ok) {
        console.error('Create order error:', response)
        throw new Error('Failed to create order');
      }

      return response.json();
    },
  });
}

export function useCaptureOrder() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/checkout/capture-order/${orderId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to capture order');
      }

      return response.json();
    },
  });
} 