<script setup lang="ts">
import { ref } from 'vue';

import { VBtn, VCard, VList, VListItem } from 'vuetify/components';

import { useAuthStore } from '@/stores/auth';
import { UsersApi } from '@/generated-sources/openapi/index';

const { accessToken } = useAuthStore();

const usersApi = new UsersApi();

const users = ref<Awaited<ReturnType<UsersApi['apiV1UsersGet']>>['data']>([]);
const fetchUsers = async () => {
  try {
    const response = await usersApi.apiV1UsersGet({
      headers: { authorization: `Bearer ${accessToken}` },
    });
    users.value = response.data;
  } catch (e) {
    console.warn({ e });
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
