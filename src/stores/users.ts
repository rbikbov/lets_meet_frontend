import { ref } from 'vue';
import { defineStore } from 'pinia';

import { api } from '@/services';
import type { User } from '@/services/api';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);

  async function fetchUsers() {
    const result = await api.api.v1UsersList();
    users.value = result.data;
    return result;
  }

  return {
    users,
    fetchUsers,
  };
});
