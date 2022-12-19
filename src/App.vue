<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useDialogsStore } from './stores/dialogs';
import { useNotificationsStore } from './stores/notifications';

useNotificationsStore();
useDialogsStore();
</script>

<template>
  <RouterView />
</template>

<style></style>
