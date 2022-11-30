import { ref, computed, watchSyncEffect } from 'vue';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import type {
  SigninRequestDataUser,
  SignupRequestDataUser,
  User,
} from '@/services/api';
import { api, setAuthorizationToken, setRefreshInterceptor } from '@/services';

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

  watchSyncEffect(() => {
    setUserInfoFromDecodedToken();
    setAuthorizationToken(accessToken.value);
  });
  // tokens end

  // user start
  const user = ref<UserType>(null);

  function setUserInfoFromDecodedToken() {
    user.value = accessToken.value ? jwt_decode<User>(accessToken.value) : null;
  }
  // user end

  // auth methods start
  async function signUp(user: SignupRequestDataUser) {
    await api.api.v1UsersCreate({ user });
  }
  async function signIn(user: SigninRequestDataUser) {
    const result = await api.api.v1SessionsCreate({ user });
    setTokens({
      accessToken: result.data.token!,
      refreshToken: result.data.refresh!,
    });
  }
  async function signOut() {
    await api.api.v1SessionsLogoutDelete({ token: accessToken.value! });
    removeTokens();
  }
  async function refreshAccessToken() {
    const result = await api.api.v1SessionsRefreshCreate({
      token: refreshToken.value!,
    });
    setTokens({
      accessToken: result.data.token!,
      refreshToken: result.data.refresh!,
    });
  }
  // auth methods end

  // initialize start
  getTokens();
  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && refreshToken.value)
  );
  // initialize end

  setRefreshInterceptor({
    isAuthenticated,
    accessToken,
    refreshAccessToken,
    signOut,
    removeTokens,
  });

  return {
    accessToken,
    refreshToken,

    user,
    isAuthenticated,

    signUp,
    signIn,
    signOut,
    refreshAccessToken,
  };
});
