<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { Notification, NotificationType } from '@/services/api';
import BaseLoader from '@/components/BaseLoader.vue';

const AsyncNotificationItemTodo = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemTodo.vue'),
  loadingComponent: BaseLoader,
});
const AsyncNotificationItemLike = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemLike.vue'),
  loadingComponent: BaseLoader,
});

defineProps<{
  notification: Notification;
}>();

const notificationTypeToComponentMap = {
  [NotificationType.Confirm]: AsyncNotificationItemTodo,
  [NotificationType.Like]: AsyncNotificationItemLike,
  [NotificationType.Mutuality]: AsyncNotificationItemTodo,
  [NotificationType.System]: AsyncNotificationItemTodo,
  [NotificationType.Visited]: AsyncNotificationItemTodo,
};
</script>

<template>
  <v-card>
    <component
      :is="notificationTypeToComponentMap[notification.notification_type]"
      :notification="notification"
    />
  </v-card>
</template>
