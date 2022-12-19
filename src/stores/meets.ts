import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { User } from '@/services/api';

export const useMeetsStore = defineStore('meets', () => {
  const meets = ref<User[]>([]);

  function setMeets(data: User[]) {
    meets.value = data;
  }

  return {
    meets,
    setMeets,
  };
});
