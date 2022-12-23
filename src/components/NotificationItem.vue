<script setup lang="ts">
import { defineAsyncComponent, defineComponent, h } from 'vue';

import { Notification, NotificationType } from '@/services/api';
import { VProgressCircular } from 'vuetify/components/VProgressCircular';

const LoadingComponent = defineComponent({
  render: () =>
    h('div', { class: 'd-flex justify-center pa-3' }, [
      h(VProgressCircular, { indeterminate: true }),
    ]),
});

const AsyncNotificationItemTodo = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemTodo.vue'),
  loadingComponent: LoadingComponent,
});
const AsyncNotificationItemLike = defineAsyncComponent({
  loader: () => import('@/components/NotificationItemLike.vue'),
  loadingComponent: LoadingComponent,
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
