import { ref, computed, watchSyncEffect } from 'vue';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
// import { useQuery } from '@tanstack/vue-query';

import type { JwtPayload, Me } from '@/services/api';
import { setApiInterceptors, setAuthorizationToken } from '@/services';
import { fetchMe } from '@/services/auth';
// import { AUTH_USER } from '@/services/queries/keys';

type TokenType = string | null;
type JWTPayloadType = JwtPayload | null;
type AuthUserType = Me | null;

const ACCESS_TOKEN_KEY = 'at_key';
const REFRESH_TOKEN_KEY = 'rt_key';

export const useAuthStore = defineStore('authStore', () => {
  const accessToken = ref<TokenType>('');
  const refreshToken = ref<TokenType>('');
  const jwtPayload = ref<JWTPayloadType>(null);
  const authUser = ref<AuthUserType>(null);

  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && refreshToken.value)
  );
  const isAdmin = computed(() =>
    Boolean(isAuthenticated.value && jwtPayload.value?.admin)
  );

  const setAuthUser = (data: AuthUserType) => {
    authUser.value = data;
  };

  function _loadTokens() {
    accessToken.value = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    refreshToken.value = localStorage.getItem(REFRESH_TOKEN_KEY) || '';
  }

  function setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    _loadTokens();
  }

  function removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    _loadTokens();
  }

  function logOut() {
    removeTokens();
    setAuthUser(null);
    window.location.reload();
  }

  watchSyncEffect(() => {
    jwtPayload.value = accessToken.value
      ? jwt_decode<JwtPayload>(accessToken.value)
      : null;
    setAuthorizationToken(accessToken.value);
    if (accessToken.value) {
      fetchMe().then((result) => {
        setAuthUser(result.data);
      });
      // const fetchMeQuery = useQuery({
      //   queryKey: [AUTH_USER],
      //   queryFn: () => fetchMe(),
      //   enabled: false,
      //   onSuccess: (result) => {
      //     setAuthUser(result.data);
      //   },
      // });
      // fetchMe.refetch();
    } else {
      setAuthUser(null);
    }
  });

  _loadTokens();

  setApiInterceptors();

  return {
    accessToken,
    refreshToken,

    jwtPayload,
    authUser,
    isAuthenticated,
    isAdmin,

    setTokens,
    // removeTokens,
    setAuthUser,
    logOut,
  };
});
