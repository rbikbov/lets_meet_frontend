<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import { signOut } from '@/services/auth';

const router = useRouter();

const { logOut } = useAuthStore();

const signOutMutation = useMutation(() => signOut(), {
  // mutationKey: [],
  onSuccess: () => {
    logOut();
    router.push({
      name: AppRouteNames.authSignin,
    });
  },
});

const onSignOut = async () => {
  await signOutMutation.mutate();
};
</script>

<template>
  <slot :loading="signOutMutation.isLoading.value" :onSignOut="onSignOut" />
</template>

<style></style>
