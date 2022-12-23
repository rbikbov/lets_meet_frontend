<script setup lang="ts">
// @ts-nocheck

import { computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';

import type { Notification } from '@/services/api';
import { confirmMeet, declineMeet } from '@/services/meets';
import { getFullDateTime } from '@/helpers/dateFormatter';

import BaseDefaultAvatarWrapper from './BaseDefaultAvatarWrapper.vue';

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
  mutationFn: (id: number) => confirmMeet(id).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
  },
});

const declineMeetMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) => declineMeet(id).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
  },
});

const onConfirmClick = () => {
  confirmMeetMutation.mutate(props.notification.content.user_ids[0]);
};

const onDeclineClick = () => {
  declineMeetMutation.mutate(props.notification.content.user_ids[0]);
};
</script>

<template>
  <div class="d-flex flex-no-wrap">
    <BaseDefaultAvatarWrapper v-slot="{ url }" :avatar-url="userAvatarUrl">
      <v-avatar class="ma-3" :size="125" :rounded="true">
        <v-img alt="Avatar" :src="url" cover></v-img>
      </v-avatar>
    </BaseDefaultAvatarWrapper>

    <div class="d-flex flex-column flex-grow-1">
      <v-card-title class="text-h5">{{
        notification.content.text_notification
      }}</v-card-title>

      <v-card-subtitle>{{
        getFullDateTime(notification.created_at)
      }}</v-card-subtitle>

      <v-card-actions class="mt-auto align-self-end">
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
</template>
