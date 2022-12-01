<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form @submit.prevent="onSubmit">
        <v-btn
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Sign Out
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  emits: {
    submit: null,
  },

  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>
