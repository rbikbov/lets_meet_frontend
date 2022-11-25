<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';

import AuthSignoutForm from '@/components/AuthSignoutForm.vue';

import router from '@/router';

const { signOut } = useAuthStore();

const authSignoutFormIsLoading = ref(false);

const onAuthSignoutFormSubmit = async () => {
  authSignoutFormIsLoading.value = true;
  try {
    await signOut();
    router.push({ name: 'home' });
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
