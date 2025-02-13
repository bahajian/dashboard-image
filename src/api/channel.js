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

// Clear SWR cache on logout
export function clearCache() {
  mutate(() => true, undefined, { revalidate: false }); // Clear all cached SWR keys
}

// The fetcher function for SWR, which uses our Axios instance
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${process.env.VITE_APP_API_URL}api/channel`;

/**
 * Hook to get all ENABLED channels
 * Endpoint: GET /channel/list
 */
export function useGetChannels() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${API_BASE}/list`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  const memoizedValue = useMemo(
    () => ({
      channels: data?.channels,
      channelsLoading: isLoading,
      channelsError: error,
      channelsValidating: isValidating,
      channelsEmpty: !isLoading && (!data?.channels || data.channels.length === 0),
      revalidateChannels: mutate // Expose revalidate function
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/**
 * Hook to get a single channel by ID
 * Endpoint: GET /channel?id=<channelId>
 */
export function useGetChannelById(channelId) {
  const url = channelId ? `${API_BASE}?id=${channelId}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  return {
    channel: data?.channel,
    channelLoading: isLoading,
    channelError: error,
    channelValidating: isValidating,
    revalidateChannel: mutate
  };
}

/**
 * Hook to get channels owned by the current user
 * Endpoint: GET /channel/mychannels
 */
export function useGetMyChannels() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${API_BASE}/mychannels`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  return {
    myChannels: data?.channels,
    myChannelsLoading: isLoading,
    myChannelsError: error,
    myChannelsValidating: isValidating,
    revalidateChannels: mutate
  };
}

/**
 * Create a new channel
 * Endpoint: POST /channel
 */
export async function insertChannel(newChannel) {
  try {
    const response = await axiosInstance.post(API_BASE, newChannel);
    // Immediately add the new channel to SWR cache
    const createdChannel = response.data.channel;
    mutate(`${API_BASE}/list`, (current) => {
      if (!current?.channels) return current;
      return { ...current, channels: [...current.channels, createdChannel] };
    }, false);

    mutate(`${API_BASE}/mychannels`, (current) => {
      if (!current?.channels) return current;
      return { ...current, channels: [...current.channels, createdChannel] };
    }, false);
  } catch (error) {
    console.error('Error inserting channel:', error);
  }

  // Revalidate data from the server
  mutate(`${API_BASE}/list`);
  mutate(`${API_BASE}/mychannels`);
}

/**
 * Update a channel by ID
 * Endpoint: PUT /channel (id in body)
 */
export async function updateChannel(channelId, updatedChannel) {
  try {
    mutate(`${API_BASE}/list`, (current) => {
      if (!current?.channels) return current;
      const updatedChannels = current.channels.map((ch) => (ch.id === channelId ? { ...ch, ...updatedChannel } : ch));
      return { ...current, channels: updatedChannels };
    }, false);

    mutate(`${API_BASE}/mychannels`, (current) => {
      if (!current?.channels) return current;
      const updatedChannels = current.channels.map((ch) => (ch.id === channelId ? { ...ch, ...updatedChannel } : ch));
      return { ...current, channels: updatedChannels };
    }, false);

    await axiosInstance.put(API_BASE, { id: channelId, ...updatedChannel });

    mutate(`${API_BASE}/list`);
    mutate(`${API_BASE}/mychannels`);
  } catch (error) {
    console.error('Error updating channel:', error);
  }
}

/**
 * Delete a channel by ID
 * Endpoint: DELETE /channel?id=<channelId>
 */
export async function deleteChannel(channelId) {
  try {
    mutate(`${API_BASE}/list`, (current) => {
      if (!current?.channels) return current;
      const remainingChannels = current.channels.filter((ch) => ch.id !== channelId);
      return { ...current, channels: remainingChannels };
    }, false);

    mutate(`${API_BASE}/mychannels`, (current) => {
      if (!current?.channels) return current;
      const remainingChannels = current.channels.filter((ch) => ch.id !== channelId);
      return { ...current, channels: remainingChannels };
    }, false);

    await axiosInstance.delete(`${API_BASE}?id=${channelId}`);

    mutate(`${API_BASE}/list`);
    mutate(`${API_BASE}/mychannels`);
  } catch (error) {
    console.error('Error deleting channel:', error);
  }
}
