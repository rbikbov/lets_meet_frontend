<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';

import AuthSigninForm from '@/components/AuthSigninForm.vue';

import {
  SessionsApi,
  type ApiV1SessionsPostRequest,
} from '@/generated-sources/openapi/index';

const { setAccessToken, setRefreshToken, isAuthenticated } = useAuthStore();

const sessionsApi = new SessionsApi();

const authSigninFormIsLoading = ref(false);
const onAuthSigninFormSubmit = async (
  user: ApiV1SessionsPostRequest['user']
) => {
  authSigninFormIsLoading.value = true;
  try {
    const result = await sessionsApi.apiV1SessionsPost({ user });
    setAccessToken(result.data.token!);
    setRefreshToken(result.data.refresh!);

    console.log({ data: result.data, isAuthenticated });
  } catch (error) {
    console.warn({ error });
  } finally {
    authSigninFormIsLoading.value = false;
  }
};
</script>

<template>
  <AuthSigninForm
    :loading="authSigninFormIsLoading"
    @submit="onAuthSigninFormSubmit"
  />
</template>

<style></style>
