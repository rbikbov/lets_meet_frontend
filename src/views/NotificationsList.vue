<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { DIALOGS } from '@/services/queries/keys';
import { fetchNotifications } from '@/services/notifications';

const { notifications } = storeToRefs(useNotificationsStore());
const { setNotifications } = useNotificationsStore();

const { authUser } = storeToRefs(useAuthStore());

const notificationsQuery = useQuery({
  queryKey: [DIALOGS],
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
        <v-card
          :title="JSON.stringify(notification.content)"
          :subtitle="`Notification created at ${notification.created_at}`"
          text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
        >
          <!--
          <v-btn
            type="button"
            :to="{
              name: AppRouteNames.notificationDetail,
              params: { id: notification.id },
            }"
          >
            Open notification
          </v-btn>
          -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
