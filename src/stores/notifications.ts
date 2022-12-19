import { ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import type { Notification } from '@/services/api';
import { useActionCable } from '@/services/actionCable';
import { useAuthStore } from './auth';

export const useNotificationsStore = defineStore('notifications', () => {
  const { accessToken, isAuthenticated } = storeToRefs(useAuthStore());
  const notifications = ref<Notification[]>([]);

  function setNotifications(data: Notification[]) {
    notifications.value = data;
  }

  const actionCable = useActionCable({ accessToken });

  let notificationsSubscribtion: ReturnType<
    typeof actionCable.subscribeToNotificationsChannel
  > = null;

  watch(
    accessToken,
    (val) => {
      if (isAuthenticated.value && val) {
        notificationsSubscribtion = actionCable.subscribeToNotificationsChannel(
          {
            received(data) {
              notifications.value.push(data.notification);

              // TODO: maybe fetch dialog???
              // if (data.notification.notification_type === NotificationType.Confirm)
            },
            connected: () => console.log('Connected to notifications stream'),
          }
        );
      } else {
        // TODO: check unsubscribing
        notificationsSubscribtion?.unsubscribe();
      }
    },
    { immediate: true }
  );

  return {
    notifications,
    setNotifications,
  };
});
