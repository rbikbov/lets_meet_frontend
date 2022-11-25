<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { VBtn, VCard, VList, VListItem } from 'vuetify/components';

import { useAuthStore } from '@/stores/auth';
import { Configuration, UsersApi } from '@/generated-sources/openapi/index';

const { accessToken } = storeToRefs(useAuthStore());

const getUsersApi = () =>
  new UsersApi(
    new Configuration(
      accessToken.value ? { accessToken: accessToken.value } : {}
    )
  );

const usersIsLoading = ref(false);
const users = ref<Awaited<ReturnType<UsersApi['apiV1UsersGet']>>['data']>([]);
const fetchUsers = async () => {
  try {
    usersIsLoading.value = true;
    const response = await getUsersApi().apiV1UsersGet();
    users.value = response.data;
  } catch (e) {
    console.warn({ e });
  } finally {
    usersIsLoading.value = false;
  }
};
fetchUsers();
</script>

<template>
  <v-card class="mx-auto">
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="fetchUsers"
    >
      Fetch users
    </v-btn>

    <br />

    <v-list lines="three">
      <v-list-item
        v-for="user in users"
        :key="user.id"
        :title="user.email"
        :subtitle="`User id is ${user.id}`"
      ></v-list-item>
    </v-list>
  </v-card>
</template>

<style></style>
