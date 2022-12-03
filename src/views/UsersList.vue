<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useUsersStore } from '@/stores/users';
import { USERS } from '@/services/queries/keys';
import { fetchUsers } from '@/services/users';

const { users } = storeToRefs(useUsersStore());
const { setUsers } = useUsersStore();

const usersQuery = useQuery({
  queryKey: [USERS],
  queryFn: () => fetchUsers(),
  onSuccess: (response) => {
    setUsers(response.data);
  },
});
</script>

<template>
  <v-container fluid>
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="usersQuery.refetch"
    >
      Fetch users
    </v-btn>

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
