<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { NOTIFICATIONS } from '@/services/queries/keys';
import { fetchNotifications } from '@/services/notifications';

import NotificationItem from '@/components/NotificationItem.vue';

const { notifications } = storeToRefs(useNotificationsStore());
const { setNotifications } = useNotificationsStore();

const { authUser } = storeToRefs(useAuthStore());

const notificationsQuery = useQuery({
  queryKey: [NOTIFICATIONS],
  queryFn: () => fetchNotifications(authUser.value?.id!),
  onSuccess: (response) => {
    setNotifications(response.data);
  },
});
</script>

<template>
  <v-container fluid>
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="notificationsQuery.refetch"
    >
      Fetch notifications
    </v-btn>

    <v-row dense>
      <v-col
        v-for="notification in notifications"
        :key="notification.id"
        cols="12"
      >
        <NotificationItem :notification="notification" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
