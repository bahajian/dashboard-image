import useSWR, { mutate } from 'swr';
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

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${window.env.VITE_APP_API_URL}api/signal`;

/**
 * Hook to get signals by channelId with pagination
 * Endpoint: GET /signal?channelId=xxx&limit=xxx&skip=xxx
 */
export function useGetSignalsByChannel(channelId, limit = 10, skip = 0) {
  const url = channelId ? `${API_BASE}?channelId=${channelId}&limit=${limit}&skip=${skip}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    signals: data?.signals || [],
    signalsLoading: isLoading,
    signalsError: error,
    signalsValidating: isValidating,
    signalsEmpty: !isLoading && (!data?.signals || data.signals.length === 0),
    revalidateSignals: mutate,
  };
}

/**
 * Hook to get a single signal by ID
 * Endpoint: GET /signal/:id
 */
export function useGetSignalById(signalId) {
  const url = signalId ? `${API_BASE}/${signalId}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    signal: data?.signal,
    signalLoading: isLoading,
    signalError: error,
    signalValidating: isValidating,
    revalidateSignal: mutate,
  };
}

/**
 * Create a new signal
 * Endpoint: POST /signal
 */
export async function createSignal(newSignal) {
  try {
    const response = await axiosInstance.post(API_BASE, newSignal);

    // Revalidate cache for the specific channel
    mutate(`${API_BASE}?channelId=${newSignal.channelId}`);

    return response.data;
  } catch (error) {
    console.error('Error creating signal:', error);
    throw error;
  }
}

/**
 * Update a signal
 * Endpoint: PUT /signal
 */
export async function updateSignal(updatedSignal) {
  try {
    const { id, channelId, ...updateFields } = updatedSignal;

    if (!id) {
      throw new Error('Signal ID is required for updating a signal.');
    }

    mutate(`${API_BASE}?channelId=${channelId}`, (current) => {
      if (!current?.signals) return current;
      return {
        ...current,
        signals: current.signals.map((signal) =>
          signal.id === id ? { ...signal, ...updateFields } : signal
        ),
      };
    }, false);

    const response = await axiosInstance.put(API_BASE, updatedSignal);
    mutate(`${API_BASE}?channelId=${channelId}`);
    return response.data;
  } catch (error) {
    console.error('Error updating signal:', error);
    throw error;
  }
}

/**
 * Delete a signal by ID
 * Endpoint: DELETE /signal?id=<signalId>
 */
export async function deleteSignal(signalId, channelId) {
  try {
    await axiosInstance.delete(`${API_BASE}?id=${signalId}`);

    // Revalidate cache for the specific channel
    mutate(`${API_BASE}?channelId=${channelId}`);
  } catch (error) {
    console.error('Error deleting signal:', error);
    throw error;
  }
}
