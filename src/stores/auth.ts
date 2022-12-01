import { ref, computed, watchSyncEffect } from 'vue';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import type {
  JwtPayload,
  ProfileDataUser,
  SigninRequestDataUser,
  SignupRequestDataUser,
  User,
} from '@/services/api';
import { api, setAuthorizationToken, setRefreshInterceptor } from '@/services';

// type TokenType = string;
type TokenType = string | null;
type JWTPayloadType = JwtPayload | null;
type UserType = User | null;

const ACCESS_TOKEN_KEY = 'at_key';
const REFRESH_TOKEN_KEY = 'rt_key';

export const useAuthStore = defineStore('auth', () => {
  // user start
  const jwtPayload = ref<JWTPayloadType>(null);

  function getTokenPayload(token: TokenType) {
    jwtPayload.value = token ? jwt_decode<JwtPayload>(token) : null;
  }

  const user = ref<UserType>(null);

  async function fetchUserInfo() {
    if (!jwtPayload.value) {
      throw new Error("Can't fetch anonymous user data.");
    }

    try {
      const result = await api.api.v1UsersDetail(String(jwtPayload.value.id));
      user.value = result.data;
    } catch (e) {
      console.warn(e);
    }
  }

  async function updateUserInfo(profile: ProfileDataUser) {
    if (!jwtPayload.value) {
      throw new Error("Can't update anonymous user profile.");
    }
    try {
      const result = await api.api.v1UsersPartialUpdate(
        String(jwtPayload.value.id),
        { profile }
      );
      user.value = result.data;
    } catch (e) {
      console.warn(e);
    }
  }
  // user end

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
    getTokenPayload(accessToken.value);
    setAuthorizationToken(accessToken.value);
    if (accessToken.value) {
      fetchUserInfo();
    }
  });
  // tokens end

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
    await api.api.v1SessionsLogoutDelete();
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
  const isAdmin = computed(() =>
    Boolean(isAuthenticated.value && jwtPayload.value?.admin)
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

    jwtPayload,
    user,
    isAuthenticated,
    isAdmin,

    fetchUserInfo,
    updateUserInfo,

    signUp,
    signIn,
    signOut,
    refreshAccessToken,
  };
});
