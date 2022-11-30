<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import AuthSignoutForm from '@/components/AuthSignoutForm.vue';

const router = useRouter();

const { signOut } = useAuthStore();

const authSignoutFormIsLoading = ref(false);

const onAuthSignoutFormSubmit = async () => {
  authSignoutFormIsLoading.value = true;
  try {
    await signOut();
    router.push({
      name: AppRouteNames.authSignin,
    });
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
