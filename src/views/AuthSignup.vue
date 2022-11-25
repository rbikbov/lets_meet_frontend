<script setup lang="ts">
import { ref } from 'vue';

import type { User } from '@/services/api';
import UserCreateForm from '@/components/UserCreateForm.vue';

import { signUp } from '@/stores/auth';

const userCreateFormIsLoading = ref(false);
const onUserCreateFormSubmit = async (user: User) => {
  userCreateFormIsLoading.value = true;
  try {
    await signUp(user);
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
