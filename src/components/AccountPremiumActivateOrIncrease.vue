<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';

import { activatePremium } from '@/services/coins';

const premiumActivateMutation = useMutation({
  // mutationKey: [],
  mutationFn: () => activatePremium(),
  onSuccess: (response) => {
    alert(response.data);
  },
});

const onActivate = async () => {
  await premiumActivateMutation.mutate();
};
</script>

<template>
  <slot
    :loading="premiumActivateMutation.isLoading.value"
    :onActivate="onActivate"
  />
</template>

<style></style>
