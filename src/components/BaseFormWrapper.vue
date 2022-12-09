<script setup lang="ts">
const formProps = {
  // someDefaultTextProp: 'Hello world',
};
</script>

<template>
  <v-sheet class="pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344" variant="outlined">
      <slot :formProps="formProps"></slot>
    </v-card>
  </v-sheet>
</template>
