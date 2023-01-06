<script setup lang="ts">
import type { Message } from '@/services/api';

import { getFullDateTime } from '@/helpers/dateFormatter';

const props = defineProps<{
  message: Message;
}>();

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
    <v-card-text class="pa-0">
      {{ message.description }}
    </v-card-text>

    <div class="d-flex flex-row justify-space-between align-end">
      <v-card-subtitle class="pa-0 mr-4">
        {{ getMessageSubtitle(message) }}
      </v-card-subtitle>

      <v-icon
        class="ma-0"
        :icon="message.read ? 'mdi-check-all' : 'mdi-check'"
        size="18"
      />
    </div>
  </v-card>
</template>
