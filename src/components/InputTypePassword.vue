<script setup lang="ts">
import { ref } from 'vue';

const isPassword = ref(true);
const toggleType = () => (isPassword.value = !isPassword.value);
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    :type="isPassword ? 'password' : 'text'"
    :append-inner-icon="isPassword ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="toggleType"
  />
</template>
