<script setup lang="ts">
import { withDefaults } from 'vue';

type Props = {
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo';
};

// const props = withDefaults(defineProps<VField['$props']>(), defaultInputProps);
const props = withDefaults(defineProps<Props>(), {
  variant: 'outlined',
});
</script>

<template>
  <slot :inputProps="props"></slot>
</template>
