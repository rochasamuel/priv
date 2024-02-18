import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/backend-sdk';
import axios from 'axios';

const useBackendClient = (initialAccessToken?: string) => {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<any>(session?.user.accessToken);
  const [api, setApi] = useState(apiClient(session?.user.accessToken));
  const [readyToFetch, setReadyToFecth] = useState(false);

  useEffect(() => {
    setAccessToken(session?.user.accessToken);
  }, [session]);

  useEffect(() => {
    if (accessToken) {
      setApi(apiClient(accessToken));
      setReadyToFecth(true);
    }
  }, [accessToken]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken.access_token}`;
            // Retry the original request with the new access token
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Optionally, handle the refresh error here
            throw error;
          }
        }

        throw error;
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [api]);

  const refreshAccessToken = async () => {
    const newAccessToken = await api.auth.refreshAccessToken(session?.user.refreshToken!);
    setAccessToken(newAccessToken.access_token);
    return newAccessToken;
  };

  return {
    api,
    readyToFetch,
  };
};

export default useBackendClient;