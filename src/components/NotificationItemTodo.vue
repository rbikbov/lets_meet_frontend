<script setup lang="ts">
import type { Notification } from '@/services/api';

import { getFullDateTime } from '@/helpers/dateFormatter';

defineProps<{
  notification: Notification;
}>();
</script>

<template>
  <div>
    <v-card-title>{{
      `Notification type: ${notification.notification_type}`
    }}</v-card-title>

    <v-card-subtitle>{{
      `Notification created: ${getFullDateTime(notification.created_at)}`
    }}</v-card-subtitle>

    <v-card-item>
      <v-expansion-panels>
        <v-expansion-panel title="Full notification data:">
          <v-expansion-panel-text>
            <pre class="overflow-auto">{{ notification }}</pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-item>
  </div>
</template>
