<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useSnackbarsStore } from '@/stores/snackbars';

const { snackbars } = storeToRefs(useSnackbarsStore());

const { removeSnackbar } = useSnackbarsStore();
</script>

<template>
  <v-snackbar
    v-for="snackbar in snackbars"
    :key="snackbar.id"
    :model-value="snackbar.shown"
    :timeout="snackbar.timeout"
    vertical
    multi-line
    @update:modelValue="removeSnackbar(snackbar)"
  >
    <div v-if="snackbar.title" class="text-subtitle-1 pb-2">
      {{ snackbar.title }}
    </div>

    <p v-if="snackbar.text">{{ snackbar.text }}</p>

    <template v-slot:actions>
      <v-btn color="indigo" variant="text" @click="removeSnackbar(snackbar)">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
