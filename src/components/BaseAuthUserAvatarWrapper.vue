<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';

import BaseAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';

const { authUser } = storeToRefs(useAuthStore());
</script>

<template>
  <BaseAvatarWrapper v-slot="{ url }" :avatar-url="authUser?.avatar">
    <slot :url="url"></slot>
  </BaseAvatarWrapper>
</template>
