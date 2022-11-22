<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';

import AuthSignoutForm from '@/components/AuthSignoutForm.vue';

import { Configuration, SessionsApi } from '@/generated-sources/openapi/index';

const { accessToken, removeAccessToken, removeRefreshToken, getAccessToken } =
  useAuthStore();

const getSessionApi = () => {
  const configuration = new Configuration({
    accessToken: accessToken || getAccessToken,
  });
  const sessionsApi = new SessionsApi(configuration);
  console.log(configuration.accessToken);
  return sessionsApi;
};

const authSignoutFormIsLoading = ref(false);
const onAuthSignoutFormSubmit = async () => {
  authSignoutFormIsLoading.value = true;
  try {
    await getSessionApi().apiV1SessionsLogoutDelete();
    removeAccessToken();
    removeRefreshToken();
  } catch (error) {
    console.warn({ error });
  } finally {
    authSignoutFormIsLoading.value = false;
  }
};
</script>

<template>
  <AuthSignoutForm @click="onAuthSignoutFormSubmit" />
</template>

<style></style>
