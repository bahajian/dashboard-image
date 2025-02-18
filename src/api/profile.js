import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

// Create an Axios instance for authenticated requests
const axiosInstance = axios.create();

// Attach a request interceptor to handle authorization headers for authenticated requests
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('serviceToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('serviceToken'); // Clear token
      await mutate(`${import.meta.env.VITE_APP_API_URL}api/profile`, null, false); // Clear SWR cache
    }
    return Promise.reject(error);
  }
);

// The fetcher function for SWR, which uses our authenticated Axios instance
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${import.meta.env.VITE_APP_API_URL}api/profile`;

export function useGetProfile() {
  const serviceToken = localStorage.getItem('serviceToken'); // Retrieve the token from localStorage
  const swrKey = serviceToken ? `${API_BASE}?token=${serviceToken}` : null; // Unique key per user session

  const { data, isLoading, error, isValidating } = useSWR(
    swrKey, // SWR fetch key tied to token
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      profile: data?.profile,
      profileLoading: isLoading,
      profileError: error,
      profileValidating: isValidating,
      profileEmpty: !isLoading && !data?.profile,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export async function insertProfile(newProfile) {
  // Insert profile without needing authorization (e.g., registration)
  // Using plain axios here to ensure no token is attached, even if present
  await axios.post(API_BASE, newProfile);
}

export async function updateProfile(updatedProfile) {
  // Optimistically update the cached profile
  mutate(
    API_BASE,
    (current) => {
      return { ...current, profile: { ...current.profile, ...updatedProfile } };
    },
    false
  );

  console.log(JSON.stringify(updatedProfile));
  // Update server (PUT /api/profile)
  await axiosInstance.put(API_BASE, updatedProfile);

  // Revalidate data from the server
  mutate(API_BASE);
}

export async function disableProfile() {
  // Optimistically mark the profile as disabled locally
  mutate(
    API_BASE,
    (current) => {
      return { ...current, profile: { ...current.profile, disabled: true } };
    },
    false
  );

  // Update server (POST /api/profile/disable)
  await axiosInstance.post(`${API_BASE}/disable`);

  // Revalidate data from the server
  mutate(API_BASE);
}

export async function login(serviceToken) {
  // Store the new token in localStorage
  localStorage.setItem('serviceToken', serviceToken);

  // Revalidate the cached profile data
  await mutate(API_BASE);
}

export async function logout() {
  // Clear localStorage and cached data
  localStorage.removeItem('serviceToken');
  await mutate(API_BASE, null, false); // Clear the cache without revalidating
}
