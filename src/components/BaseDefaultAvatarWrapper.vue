<script setup lang="ts">
import { computed, ref } from 'vue';

import { defaultAvatarUrl } from '@/helpers/defaultAvatar';

const props = defineProps<{
  avatarUrl?: string;
}>();

const loadingError = ref(false);
const onError = () => {
  loadingError.value = true;
};

const url = computed(
  () =>
    loadingError.value ? defaultAvatarUrl : props.avatarUrl || defaultAvatarUrl
  // loadingError.value
  //   ? defaultAvatarUrl
  //   : props.avatarUrl?.replace('://', '://error-check-') || defaultAvatarUrl
);
</script>

<template>
  <slot :url="url" :onError="onError"></slot>
</template>
