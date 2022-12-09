<script setup lang="ts">
import { computed } from 'vue';

import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore());

const defaultAvatarUrl = new URL(
  '../assets/blank-profile-picture.webp',
  import.meta.url
).href;

const url = computed(() => user.value?.avatar || defaultAvatarUrl);
</script>

<template>
  <slot :url="url"></slot>
</template>
