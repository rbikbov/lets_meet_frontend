import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import type { Notification } from '@/services/api';
import { useActionCable } from '@/services/actionCable';
import { useAuthStore } from './auth';

export const useNotificationsStore = defineStore('notifications', () => {
  const { accessToken } = storeToRefs(useAuthStore());
  const notifications = ref<Notification[]>([]);

  function setNotifications(data: Notification[]) {
    notifications.value = data;
  }

  const actionCable = useActionCable({ accessToken });

  // watch(
  //   accessToken,
  //   (val) => {
  //     if (isAuthenticated.value && val) {
  //       actionCable.subscribeToNotificationsChannel();
  //     } else {
  //     }
  //   },
  //   { immediate: true }
  // );

  actionCable.subscribeToNotificationsChannel({
    received(data) {
      notifications.value.push(data.notification);
    },
    connected: (...args) => console.log('Connected', args),
  });

  return {
    messages: notifications,
    setNotifications,
  };
});
