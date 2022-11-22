<script setup lang="ts">
import { ref } from 'vue';

import { UsersApiService } from '@/services/usersApiService';
import { HttpService } from '@/services/httpApiService';

import UserCreateForm from '@/components/UserCreateForm.vue';
import type { AuthSignupRequest } from '@/types/api/authSignupRequest';

const usersApiService = new UsersApiService(new HttpService());

const users = ref<Awaited<ReturnType<UsersApiService['getAll']>>['data']>([]);
const fetchUsers = async () => {
  try {
    const response = await usersApiService.getAll();
    users.value = response.data;
  } catch (e) {
    console.error({ e });
  }
};
fetchUsers();

const userCreateFormIsLoading = ref(false);
const onUserCreateFormSubmit = async (payload: AuthSignupRequest) => {
  userCreateFormIsLoading.value = true;
  try {
    await usersApiService.create({ user: payload });
  } catch (e) {
    console.error({ e });
  } finally {
    userCreateFormIsLoading.value = false;
  }
};

// const sessionsApi = new SessionsApi();
</script>

<template>
  <UserCreateForm
    :loading="userCreateFormIsLoading"
    @submit="onUserCreateFormSubmit"
  />
</template>

<style></style>
