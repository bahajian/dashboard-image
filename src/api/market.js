// src/api/market.js

import useSWR, { mutate } from 'swr';
import axios from 'axios';

const axiosInstance = axios.create();

// Attach a request interceptor to handle authorization headers
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('serviceToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Clear SWR cache on logout
export function clearCache() {
  mutate(() => true, undefined, { revalidate: false }); // Clear all cached SWR keys
}

// Debugging fetcher
const fetcher = async (url) => {
  console.log('[SWR Fetcher] Fetching:', url);
  const { data } = await axiosInstance.get(url);
  return data;
};

const API_BASE = `${process.env.VITE_APP_API_URL}api/market`;

/**
 * Hook to get autocomplete results by query
 * Endpoint: GET /api/market/autocomplete
 */
export function useAutocomplete(query) {
  // Only fetch if query is non-empty
  const url = query?.trim()
    ? `${API_BASE}/autocomplete?query=${encodeURIComponent(query)}`
    : null;
  
  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: revalidateAutocomplete,
  } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    results: data?.results || [],
    autocompleteLoading: isLoading,
    autocompleteError: error,
    autocompleteValidating: isValidating,
    revalidateAutocomplete,
  };
}

/**
 * Hook to get symbol details by symbol
 * Endpoint: GET /api/market/symbol-details
 */
export function useSymbolDetails(symbol) {
  const url = symbol?.trim()
    ? `${API_BASE}/symbol-details?symbol=${encodeURIComponent(symbol)}`
    : null;

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: revalidateDetails,
  } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    details: data?.details || {},
    detailsLoading: isLoading,
    detailsError: error,
    detailsValidating: isValidating,
    revalidateDetails,
  };
}

/**
 * Hook to get price and volume by symbol
 * Endpoint: GET /api/market/price-volume
 */
export function usePriceAndVolume(symbol) {
  
  const url = symbol?.trim()
    ? `${API_BASE}/price-volume?symbol=${encodeURIComponent(symbol)}`
    : null;
  
  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: revalidatePriceVolume,
  } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.log('[usePriceAndVolume] Data:', JSON.stringify(data));

  return {
    price: data?.currentPrice || null,
    volume: data?.volume || null,
    priceVolumeLoading: isLoading,
    priceVolumeError: error,
    priceVolumeValidating: isValidating,
    revalidatePriceVolume,
  };
}
