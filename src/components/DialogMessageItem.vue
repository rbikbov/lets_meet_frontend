<script setup lang="ts">
import type { Me, Message, User } from '@/services/api';

import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';
import BaseLoader from '@/components/BaseLoader.vue';

import { getFullName } from '@/helpers/fullName';
import { getFullDateTime } from '@/helpers/dateFormatter';

const props = defineProps<{
  message: Message;
  isMyMsg: boolean;
  isAuthorPrevMsg: boolean;
  me: Me;
  interlocutor: User;
}>();

const formatMessageTitle = (title: string) => `${title}:`;

const getMessageTitle = (msg: Message): string => {
  if (msg.user_id === props.me?.id) {
    return formatMessageTitle(props.me ? getFullName(props.me) : 'From me');
  }

  return formatMessageTitle(
    props.interlocutor ? getFullName(props.interlocutor) : 'For me'
  );
};

const getMessageSubtitle = (msg: Message): string => {
  const parts: string[] = [getFullDateTime(msg.created_at)];

  if (msg.updated_at !== msg.created_at) {
    parts.push(`Edited at ${getFullDateTime(msg.updated_at)}`);
  }

  return parts.join(' ');
};
</script>

<template>
  <v-card
    class="mb-2 pa-2"
    density="compact"
    max-width="85%"
    min-width="35%"
    variant="outlined"
  >
    <div class="d-flex mb-2">
      <BaseDefaultAvatarWrapper
        v-if="!isAuthorPrevMsg"
        v-slot="{ url, onError }"
        :avatar-url="isMyMsg ? me?.avatar : interlocutor?.avatar"
      >
        <v-avatar class="mr-2" :size="40">
          <v-img alt="Avatar" cover :src="url" @error="onError">
            <template v-slot:placeholder>
              <BaseLoader />
            </template>
          </v-img>
        </v-avatar>
      </BaseDefaultAvatarWrapper>

      <div class="d-flex flex-column align-items-start">
        <v-card-title v-if="!isAuthorPrevMsg" class="pa-0">
          {{ getMessageTitle(message) }}
        </v-card-title>

        <v-card-subtitle class="pa-0">
          {{ getMessageSubtitle(message) }}
        </v-card-subtitle>
      </div>
    </div>

    <v-card-text class="pa-0">
      {{ message.description }}
    </v-card-text>

    <div class="d-flex flex-row justify-end">
      <v-icon
        class="ma-0"
        :icon="message.read ? 'mdi-check-all' : 'mdi-check'"
        size="18"
      />
    </div>
  </v-card>
</template>
