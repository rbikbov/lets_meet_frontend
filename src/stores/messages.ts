import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import type { Message } from '@/services/api';
import { useActionCable } from '@/services/actionCable';
import { useAuthStore } from './auth';

export const useMessagesStore = defineStore('messages', () => {
  const { accessToken } = storeToRefs(useAuthStore());
  const messages = ref<Message[]>([]);

  function setMessages(data: Message[]) {
    messages.value = data;
  }

  const actionCable = useActionCable({ accessToken });

  // watch(
  //   accessToken,
  //   (val) => {
  //     if (isAuthenticated.value && val) {
  //     } else {
  //     }
  //   },
  //   { immediate: true }
  // );

  actionCable.subscribeToMessagesChannel({
    received(data) {
      messages.value.push(data.message);
    },
    // appear?(): void;
    // away?(): void;
    connected: (...args) => console.log('Connected', args),
    // disconnected?(): void;
    // initialized?(): void;
    // install?(): void;
    // rejected?(): void;
    // uninstall?(): void;
    // update?(): void;

    // received?(data: any): void;

    // readonly documentIsActive?: boolean | undefined;
    // readonly appearingOn?: string | null | undefined;

    // [key: string]: any;
  });

  return {
    messages,
    setMessages,
  };
});
