<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import type { User } from '@/services/api';

import AuthSigninForm from '@/components/AuthSigninForm.vue';

const { signIn } = useAuthStore();

const authSigninFormIsLoading = ref(false);
const onAuthSigninFormSubmit = async (user: User) => {
  authSigninFormIsLoading.value = true;
  try {
    await signIn(user);
    router.push({ name: 'home' });
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
