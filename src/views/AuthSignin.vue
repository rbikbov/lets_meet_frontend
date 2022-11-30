<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/services/api';

import AuthSigninForm from '@/components/AuthSigninForm.vue';

const router = useRouter();
const { signIn } = useAuthStore();

const authSigninFormIsLoading = ref(false);
const onAuthSigninFormSubmit = async (user: User) => {
  authSigninFormIsLoading.value = true;
  try {
    await signIn(user);
    router.push({
      name: AppRouteNames.home,
    });
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
