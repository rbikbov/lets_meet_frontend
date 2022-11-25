<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';

import AuthSignoutForm from '@/components/AuthSignoutForm.vue';

import { Configuration, SessionsApi } from '@/generated-sources/openapi/index';
import { storeToRefs } from 'pinia';

const { accessToken } = storeToRefs(useAuthStore());
const { removeTokens } = useAuthStore();

const getSessionApi = () =>
  new SessionsApi(
    new Configuration(
      accessToken.value
        ? {
            accessToken: accessToken.value,
          }
        : {}
    )
  );

const authSignoutFormIsLoading = ref(false);
const onAuthSignoutFormSubmit = async () => {
  authSignoutFormIsLoading.value = true;
  try {
    await getSessionApi().apiV1SessionsLogoutDelete();
    removeTokens();
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
