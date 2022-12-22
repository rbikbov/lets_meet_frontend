<script setup lang="ts">
import { computed } from 'vue';

import { defaultAvatarUrl } from '@/helpers/defaultAvatar';

const props = defineProps<{
  avatarUrl?: string;
}>();

const url = computed(() => props.avatarUrl || defaultAvatarUrl);
</script>

<template>
  <slot :url="url"></slot>
</template>
