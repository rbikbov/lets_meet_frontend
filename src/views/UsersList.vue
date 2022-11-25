<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { VBtn, VCard, VList, VListItem } from 'vuetify/components';

import { useUsersStore } from '@/stores/users';

const { users } = storeToRefs(useUsersStore());
const { fetchUsers } = useUsersStore();

const usersIsLoading = ref(false);
const getUsers = async () => {
  try {
    usersIsLoading.value = true;
    await fetchUsers();
  } catch (e) {
    console.warn({ e });
  } finally {
    usersIsLoading.value = false;
  }
};
getUsers();
</script>

<template>
  <v-card class="mx-auto">
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="getUsers"
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
