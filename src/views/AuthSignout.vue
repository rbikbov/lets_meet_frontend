<script setup lang="ts">
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import AuthSignoutForm from '@/components/AuthSignoutForm.vue';
import { signOut } from '@/services/auth';
import { useMutation } from '@tanstack/vue-query';

const router = useRouter();

const { logOut } = useAuthStore();

const signOutMutation = useMutation(() => signOut(), {
  onSuccess: () => {
    logOut();
    router.push({
      name: AppRouteNames.authSignin,
    });
  },
});

const onAuthSignoutFormSubmit = () => {
  signOutMutation.mutate();
};
</script>

<template>
  <AuthSignoutForm
    :loading="signOutMutation.isLoading.value"
    @click="onAuthSignoutFormSubmit"
  />
</template>

<style></style>
