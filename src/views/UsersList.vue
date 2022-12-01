<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

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
  <v-container fluid>
    <!--
      <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="getUsers"
    >
      Fetch users
    </v-btn>
    -->

    <v-row dense>
      <v-col v-for="user in users" :key="user.id" cols="12">
        <v-card
          :title="user.email"
          :subtitle="`User id is ${user.id}`"
          text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
