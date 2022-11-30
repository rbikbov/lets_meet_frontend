<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/services/api';
import { mungeEmailAddress } from '@/helpers/mungeEmailAddress';

import UserCreateForm from '@/components/UserCreateForm.vue';

const router = useRouter();
const { signUp } = useAuthStore();

const userCreateFormIsLoading = ref(false);
const onUserCreateFormSubmit = async (user: User) => {
  userCreateFormIsLoading.value = true;
  try {
    await signUp(user);
    const mungedEmail = mungeEmailAddress(user.email!);
    router.push({
      name: AppRouteNames.authSignupThanks,
      query: {
        email: mungedEmail,
      },
    });
  } catch (e) {
    console.error({ e });
  } finally {
    userCreateFormIsLoading.value = false;
  }
};
</script>

<template>
  <UserCreateForm
    :loading="userCreateFormIsLoading"
    @submit="onUserCreateFormSubmit"
  />
</template>

<style></style>
