<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';

import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';

const { authUser } = storeToRefs(useAuthStore());
</script>

<template>
  <BaseDefaultAvatarWrapper
    v-slot="{ url, onError }"
    :avatar-url="authUser?.avatar"
  >
    <slot :url="url" :onError="onError"></slot>
  </BaseDefaultAvatarWrapper>
</template>
