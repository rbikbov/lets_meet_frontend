<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { Notification, NotificationType } from '@/services/api';
import BaseLoader from '@/components/BaseLoader.vue';

const AsyncNotificationItemTodo = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemTodo.vue'),
  loadingComponent: BaseLoader,
});
const AsyncNotificationItemInitiate = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemInitiate.vue'),
  loadingComponent: BaseLoader,
});

// const sleep = (seconds: number) =>
//   new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// const AsyncNotificationItemTodo = defineAsyncComponent({
//   loader: () => sleep(5).then(() => import('@/components/NotificationItemTodo.vue')),
//   loadingComponent: BaseLoader,
// });
// const AsyncNotificationItemInitiate = defineAsyncComponent({
//   loader: () => sleep(5).then(() => import('@/components/NotificationItemInitiate.vue')),
//   loadingComponent: BaseLoader,
// });

defineProps<{
  notification: Notification;
}>();

const notificationTypeToComponentMap = {
  [NotificationType.Confirm]: AsyncNotificationItemTodo,
  [NotificationType.Initiate]: AsyncNotificationItemInitiate,
  [NotificationType.Mutuality]: AsyncNotificationItemTodo,
  [NotificationType.System]: AsyncNotificationItemTodo,
  [NotificationType.Visited]: AsyncNotificationItemTodo,
};

const getNotificationComponentByType = (nType: NotificationType) => {
  if (!(nType in notificationTypeToComponentMap)) {
    return AsyncNotificationItemTodo;
  }

  return notificationTypeToComponentMap[nType];
};
</script>

<template>
  <v-card variant="outlined">
    <component
      :is="getNotificationComponentByType(notification.notification_type)"
      :notification="notification"
    />
  </v-card>
</template>
