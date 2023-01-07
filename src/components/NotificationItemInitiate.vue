<script setup lang="ts">
// @ts-nocheck

import { computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';

import type { Notification } from '@/services/api';
import { confirmMeet, declineMeet } from '@/services/meets';
import { getFullDateTime } from '@/helpers/dateFormatter';

import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';
import BaseLoader from '@/components/BaseLoader.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    notification: Notification;
  }>(),
  {
    loading: false,
  }
);

const userAvatarUrl = computed(
  () =>
    props.notification.content.images[props.notification.content.user_ids[0]]
);

const confirmMeetMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) =>
    confirmMeet(id, { notification_id: props.notification.id }).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
  },
});

const declineMeetMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) =>
    declineMeet(id, { notification_id: props.notification.id }).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
  },
});

const onConfirmClick = () => {
  confirmMeetMutation.mutate(props.notification.content.user_ids[0]);
  // TODO: hide buttons
};

const onDeclineClick = () => {
  declineMeetMutation.mutate(props.notification.content.user_ids[0]);
  // TODO: hide buttons
};
</script>

<template>
  <div class="d-flex flex-no-wrap">
    <BaseDefaultAvatarWrapper
      v-slot="{ url, onError }"
      :avatar-url="userAvatarUrl"
    >
      <v-avatar class="ma-3" :size="80" :rounded="true">
        <v-img alt="Avatar" :src="url" cover @error="onError">
          <template v-slot:placeholder>
            <BaseLoader />
          </template>
        </v-img>
      </v-avatar>
    </BaseDefaultAvatarWrapper>

    <div class="d-flex flex-column flex-grow-1">
      <v-card-title class="text-h5">{{
        notification.content.text_notification
      }}</v-card-title>

      <div class="d-flex">
        <v-card-subtitle>{{
          getFullDateTime(notification.created_at)
        }}</v-card-subtitle>

        <v-card-actions v-if="!notification.used" class="ml-auto">
          <v-btn
            variant="outlined"
            size="small"
            :loading="declineMeetMutation.isLoading.value"
            @click="onDeclineClick"
          >
            Decline
          </v-btn>
          <v-btn
            variant="outlined"
            size="small"
            append-icon="mdi-heart"
            :loading="confirmMeetMutation.isLoading.value"
            @click="onConfirmClick"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </div>
    </div>
  </div>
</template>
