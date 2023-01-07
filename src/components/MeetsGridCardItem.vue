<script setup lang="ts">
import type { User } from '@/services/api';

import BaseDefaultAvatarWrapper from './BaseDefaultAvatarWrapper.vue';
import BaseLoader from './BaseLoader.vue';

const props = withDefaults(
  defineProps<{
    user: User;
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);
</script>

<template>
  <v-card class="h-100" variant="outlined" elevation="8">
    <BaseDefaultAvatarWrapper
      v-slot="{ url, onError }"
      :avatar-url="user.avatar"
    >
      <v-img
        :src="url"
        class="align-end h-100"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.9)"
        cover
        @error="onError"
      >
        <template v-slot:placeholder>
          <BaseLoader />
        </template>

        <div class="d-flex">
          <div class="flex-grow-1 mb-4">
            <v-card-title class="text-white">{{
              user.first_name
            }}</v-card-title>

            <v-card-subtitle class="text-white">{{
              `${user.gender}, ${user.age}`
            }}</v-card-subtitle>

            <v-card-subtitle v-if="user.city" class="text-white">{{
              user.city
            }}</v-card-subtitle>
          </div>

          <v-card-actions class="mt-auto">
            <slot name="actions"></slot>
          </v-card-actions>
        </div>
      </v-img>
    </BaseDefaultAvatarWrapper>
  </v-card>
</template>
