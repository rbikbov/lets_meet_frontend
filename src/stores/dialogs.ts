import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Dialog } from '@/services/api';

export const useDialogsStore = defineStore('dialogs', () => {
  const dialogs = ref<Dialog[]>([]);

  function setDialogs(data: Dialog[]) {
    dialogs.value = data;
  }

  return {
    dialogs,
    setDialogs,
  };
});
