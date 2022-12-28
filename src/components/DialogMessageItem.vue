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
    :title="!isAuthorPrevMsg ? getMessageTitle(message) : ''"
    :subtitle="getMessageSubtitle(message)"
    :text="message.description"
    class="mb-2"
    density="compact"
    max-width="85%"
    min-width="35%"
    variant="outlined"
  >
    <template v-if="!isAuthorPrevMsg" v-slot:prepend>
      <BaseDefaultAvatarWrapper
        v-slot="{ url, onError }"
        :avatar-url="isMyMsg ? me?.avatar : interlocutor?.avatar"
      >
        <v-avatar :size="40">
          <v-img alt="Avatar" cover :src="url" @error="onError">
            <template v-slot:placeholder>
              <BaseLoader />
            </template>
          </v-img>
        </v-avatar>
      </BaseDefaultAvatarWrapper>
    </template>
  </v-card>
</template>
