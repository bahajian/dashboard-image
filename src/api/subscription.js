import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

const axiosInstance = axios.create();

// Attach a request interceptor to handle authorization headers
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('serviceToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// The fetcher function for SWR, which uses our Axios instance
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${window.env.VITE_APP_API_URL}api/subscription`;

/**
 * Hook to get subscriptions by the current user
 * Endpoint: GET /subscription
 */
export function useGetSubscriptions() {
  const { data, isLoading, error, isValidating } = useSWR(`${API_BASE}/`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      subscriptions: data?.subscriptions,
      subscriptionsLoading: isLoading,
      subscriptionsError: error,
      subscriptionsValidating: isValidating,
      subscriptionsEmpty: !isLoading && (!data?.subscriptions || data.subscriptions.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/**
 * Hook to get payment history for the current user
 * Endpoint: GET /subscription/payment-history
 */
export function useGetPaymentHistory() {
  const { data, isLoading, error, isValidating } = useSWR(`${API_BASE}/payment-history`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    paymentHistory: data?.history,
    paymentHistoryLoading: isLoading,
    paymentHistoryError: error,
    paymentHistoryValidating: isValidating,
  };
}

/**
 * Create a new subscription
 * Endpoint: POST /subscription
 */
export async function createSubscription(newSubscription) {
  const response = await axiosInstance.post(`${API_BASE}/`, newSubscription);
  mutate(`${API_BASE}/`);
  return response?.data;
}

/**
 * Update an existing subscription
 * Endpoint: PUT /subscription
 */
export async function updateSubscription(subscriptionId, updatedSubscription) {
  await axiosInstance.put(`${API_BASE}/`, { id: subscriptionId, ...updatedSubscription });
  mutate(`${API_BASE}/`);
}

/**
 * Delete a subscription by ID
 * Endpoint: DELETE /subscription
 */
export async function deleteSubscription(subscriptionId) {
  await axiosInstance.delete(`${API_BASE}/`, { data: { id: subscriptionId } });
  mutate(`${API_BASE}/`);
}

/**
 * Handle Stripe webhook events
 * Endpoint: POST /subscription/webhook
 */
export async function handleWebhookEvent(webhookPayload) {
  await axiosInstance.post(`${API_BASE}/webhook`, webhookPayload);
}

/**
 * Optimistically update or revalidate where necessary to keep the UI in sync.
 */
