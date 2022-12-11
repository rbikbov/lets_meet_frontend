<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';

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

  components: {
    BaseFormWrapper,
  },

  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>

<template>
  <BaseFormWrapper>
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
  </BaseFormWrapper>
</template>
