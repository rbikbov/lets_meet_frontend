import { Api } from '@/services/api';
import { CONFIG } from '@/config';
import type { Ref } from 'vue';
import type { AxiosError, AxiosRequestConfig } from 'axios';

interface MyAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

export const limit = 10;

export const api = new Api({
  baseURL: `${CONFIG.API_HOST}`,
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});

export function setAuthorizationToken(token: string | null): void {
  api.setSecurityData(token);
}

export function setRefreshInterceptor({
  isAuthenticated,
  accessToken,
  refreshAccessToken,
  signOut,
  removeTokens,
}: {
  isAuthenticated: Ref<boolean>;
  accessToken: Ref<string | null>;
  refreshAccessToken: () => Promise<void>;
  signOut: () => Promise<void>;
  removeTokens: () => void;
}) {
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
        error.response?.status === 401
      ) {
        removeTokens();
      }

      if (
        !isRefreshRequest &&
        !isLogoutRequest &&
        isAuthenticated.value &&
        error.response?.status === 401 &&
        originalRequest._retry === 5
      ) {
        await signOut();
      }

      if (
        !isRefreshRequest &&
        !isLogoutRequest &&
        isAuthenticated.value &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = (originalRequest._retry || 0) + 1;
        await refreshAccessToken();
        return api.instance({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken.value}`,
          },
        });
      }

      return Promise.reject(error);
    }
  );
}

export function pageToOffset(
  page: number = 1,
  localLimit = limit
): { limit: number; offset: number } {
  const offset = (page - 1) * localLimit;
  return { limit: localLimit, offset };
}
