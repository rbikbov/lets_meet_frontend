import { Api } from '@/services/api';
import { CONFIG } from '@/config';
import { refreshAccessToken, signOut } from './auth';

import type { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';

interface MyAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

export function generateAuthorizationHeaders({ token }: { token: string }) {
  return { Authorization: `Bearer ${token}` };
}

export const api = new Api({
  baseURL: `${CONFIG.API_HOST}`,
  securityWorker: (token: string | null) =>
    token ? { headers: generateAuthorizationHeaders({ token }) } : {},
});

export function setAuthorizationToken(token: string | null): void {
  console.log(`New accessToken = ${token}`);
  api.setSecurityData(token);
}

export function setApiInterceptors() {
  const authStore = useAuthStore();

  api.instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error: AxiosError) {
      const originalRequest: MyAxiosRequestConfig = error.config!;

      const isRefreshRequest = originalRequest.url!.includes(
        '/api/v1/sessions/refresh'
      );
      const isLogoutRequest = originalRequest.url!.includes(
        '/api/v1/sessions/logout'
      );

      if (originalRequest._retry && originalRequest._retry < 5) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * originalRequest._retry!)
        );
      }

      if (
        (isRefreshRequest || isLogoutRequest) &&
        error.response?.status &&
        [400, 401].includes(error.response.status)
      ) {
        authStore.logOut();
      }

      if (
        !isRefreshRequest &&
        !isLogoutRequest &&
        authStore.isAuthenticated &&
        error.response?.status &&
        [401].includes(error.response.status) &&
        originalRequest._retry === 5
      ) {
        await signOut();
        authStore.logOut();
      }

      if (
        !isRefreshRequest &&
        !isLogoutRequest &&
        authStore.isAuthenticated &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = (originalRequest._retry || 0) + 1;
        const refreshResult = await refreshAccessToken(authStore.refreshToken!);
        authStore.setTokens({
          accessToken: refreshResult.data.token,
          refreshToken: refreshResult.data.refresh,
        });
        const extraHeaders = refreshResult.data.token
          ? generateAuthorizationHeaders({ token: refreshResult.data.token })
          : {};
        return api.instance({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            ...extraHeaders,
          },
        });
      }

      return Promise.reject(error);
    }
  );
}
