<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { defaultAvatarUrl } from '@/helpers/defaultAvatar';

const { authUser } = storeToRefs(useAuthStore());

const url = computed(() => authUser.value?.avatar || defaultAvatarUrl);
</script>

<template>
  <slot :url="url"></slot>
</template>
