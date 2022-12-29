<script setup lang="ts">
import { RouterView } from 'vue-router';
// import DefaultLayout from './layouts/DefaultLayout.vue';
import { useDialogsStore } from './stores/dialogs';
import { useNotificationsStore } from './stores/notifications';

useNotificationsStore();
useDialogsStore();
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <!-- <DefaultLayout /> -->
</template>

<style></style>
