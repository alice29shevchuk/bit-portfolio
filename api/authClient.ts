import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { logout, updateTokens } from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store/index';

export const dummyJsonPlain = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 25000,
});

export const authApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 25000,
});

let interceptorsAttached = false;

export function attachAuthInterceptors(
  getState: () => RootState,
  dispatch: AppDispatch,
) {
  if (interceptorsAttached) return;
  interceptorsAttached = true;

  authApi.interceptors.request.use((config) => {
    const token = getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  createAuthRefreshInterceptor(
    authApi,
    async (failedRequest) => {
      const rt = getState().auth.refreshToken;
      if (!rt) {
        dispatch(logout());
        return Promise.reject(failedRequest);
      }
      try {
        const { data } = await dummyJsonPlain.post<{
          accessToken: string;
          refreshToken?: string;
        }>('/auth/refresh', {
          refreshToken: rt,
          expiresInMins: 60,
        });
        dispatch(
          updateTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken ?? rt,
          }),
        );
        failedRequest.response!.config.headers.Authorization =
          `Bearer ${data.accessToken}`;
        return Promise.resolve();
      } catch {
        dispatch(logout());
        return Promise.reject(failedRequest);
      }
    },
    { statusCodes: [401] },
  );
}
