import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import type { User } from '@/generated-sources/openapi';

type TokenType = string;
// type TokenType = string | null;
type UserType = User | null;

const ACCESS_TOKEN_KEY = 'at_key';
const REFRESH_TOKEN_KEY = 'rt_key';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<TokenType>('');
  const refreshToken = ref<TokenType>('');

  const user = ref<UserType>(null);

  function getAccessToken() {
    accessToken.value = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    return accessToken.value;
  }
  function getRefreshToken() {
    refreshToken.value = localStorage.getItem(REFRESH_TOKEN_KEY) || '';
    return refreshToken.value;
  }
  function setAccessToken(value: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, value);
  }
  function setRefreshToken(value: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, value);
  }
  function removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  function removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  function decodeToken() {
    user.value = jwt_decode<User>(accessToken.value!);
  }

  getAccessToken();
  getRefreshToken();

  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && refreshToken.value)
  );

  if (isAuthenticated.value) {
    decodeToken();
  }

  return {
    accessToken,
    refreshToken,

    user,
    isAuthenticated,

    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    removeAccessToken,
    removeRefreshToken,
  };
});
