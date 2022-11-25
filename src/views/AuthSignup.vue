<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import type { AuthSignupRequest } from '@/types/api/authSignupRequest';

import UserCreateForm from '@/components/UserCreateForm.vue';
import { Configuration, UsersApi } from '@/generated-sources/openapi/index';

const { accessToken } = storeToRefs(useAuthStore());

const getUsersApi = () =>
  new UsersApi(
    new Configuration(
      accessToken.value ? { accessToken: accessToken.value } : {}
    )
  );

const userCreateFormIsLoading = ref(false);
const onUserCreateFormSubmit = async (payload: AuthSignupRequest) => {
  userCreateFormIsLoading.value = true;
  try {
    await getUsersApi().apiV1UsersPost({ user: payload });
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
