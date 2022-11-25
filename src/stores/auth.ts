import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import type { User } from '@/generated-sources/openapi';

// type TokenType = string;
type TokenType = string | null;
type UserType = User | null;

const ACCESS_TOKEN_KEY = 'at_key';
const REFRESH_TOKEN_KEY = 'rt_key';

export const useAuthStore = defineStore('auth', () => {
  // tokens start
  const accessToken = ref<TokenType>('');
  const refreshToken = ref<TokenType>('');

  function getTokens() {
    accessToken.value = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    refreshToken.value = localStorage.getItem(REFRESH_TOKEN_KEY) || '';
  }
  function setTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    getTokens();
  }
  function removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    getTokens();
  }
  // tokens end

  // user start
  const user = ref<UserType>(null);

  function setUserInfoFromDecodedToken() {
    user.value = jwt_decode<User>(accessToken.value!);
  }
  // user end

  // initialize start
  getTokens();
  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && refreshToken.value)
  );

  if (isAuthenticated.value) {
    setUserInfoFromDecodedToken();
  }
  // initialize end

  return {
    accessToken,
    refreshToken,

    user,
    isAuthenticated,

    getTokens,
    setTokens,
    removeTokens,
  };
});
