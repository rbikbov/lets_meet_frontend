<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';

import { activateStars } from '@/services/coins';

const starsActivateMutation = useMutation({
  // mutationKey: [],
  mutationFn: () => activateStars(),
  onSuccess: (response) => {
    alert(response.data);
  },
});

const onActivate = async () => {
  await starsActivateMutation.mutate();
};
</script>

<template>
  <slot
    :loading="starsActivateMutation.isLoading.value"
    :onActivate="onActivate"
  />
</template>

<style></style>
