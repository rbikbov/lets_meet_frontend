<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInfiniteQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { NOTIFICATIONS } from '@/services/queries/keys';
import { fetchNotifications } from '@/services/notifications';

import NotificationItem from '@/components/NotificationItem.vue';
import { reactive, watch } from 'vue';

const { notifications } = storeToRefs(useNotificationsStore());
const { setNotifications } = useNotificationsStore();

const { authUser } = storeToRefs(useAuthStore());

const notificationsQuery = useInfiniteQuery({
  queryKey: [NOTIFICATIONS],
  queryFn: ({ pageParam }) => {
    return fetchNotifications({
      id: String(authUser.value?.id),
      page: pageParam,
    });
  },
  getNextPageParam: (lastPage, allPages) =>
    lastPage.data.has_next ? lastPage.data.current_page! + 1 : false,
  getPreviousPageParam: (firstPage, allPages) =>
    firstPage.data.has_prev ? firstPage.data.current_page! - 1 : false,
  onSuccess: (responses) => {
    const allNotifications = responses.pages.map((r) => r.data.results).flat();
    setNotifications(allNotifications);
  },
  enabled: !!authUser.value,
});

const a = reactive({
  hasNextPage: notificationsQuery.hasNextPage?.value,
  hasPreviousPage: notificationsQuery.hasPreviousPage?.value,
});

watch(() => a, console.log);

const fetchPreviousClicked = async () => {
  await notificationsQuery.fetchPreviousPage();
};
</script>

<template>
  <v-container fluid>
    <v-row dense>
      <v-col class="d-flex" cols="12">
        <v-btn
          v-if="!false"
          class="mx-auto"
          type="button"
          variant="elevated"
          icon
          :loading="notificationsQuery.isLoading.value"
          @click="notificationsQuery.refetch"
        >
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </v-col>

      <v-col
        v-for="notification in notifications"
        :key="notification.id"
        cols="12"
      >
        <NotificationItem :notification="notification" />
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-btn
          v-if="notificationsQuery.hasPreviousPage?.value"
          class="mx-auto"
          size="small"
          type="button"
          variant="outlined"
          :loading="notificationsQuery.isFetchingPreviousPage.value"
          @click="fetchPreviousClicked"
        >
          Fetch previous
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
