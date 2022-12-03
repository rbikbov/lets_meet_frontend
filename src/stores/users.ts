import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { User } from '@/services/api';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);

  function setUsers(data: User[]) {
    users.value = data;
  }

  return {
    users,
    setUsers,
  };
});
