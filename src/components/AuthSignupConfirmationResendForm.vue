<script setup lang="ts">
import { ref } from 'vue';

import type { ResendConfirmMailPayload } from '@/services/api';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const props = withDefaults(defineProps<{ loading: boolean }>(), {
  loading: false,
});

const emits = defineEmits({
  submit: (payload: ResendConfirmMailPayload) => {
    if (payload.email) {
      return true;
    } else {
      console.warn(`Invalid submit event payload!`);
      return false;
    }
  },
});

const form = ref(false);
const email = ref('');

const onSubmit = () => {
  if (props.loading) return;
  if (!form.value) return;

  emits('submit', {
    email: email.value,
  });
};

const required = (v: string) => {
  return !!v || 'Field is required';
};
</script>

<template>
  <BaseFormWrapper>
    <v-form v-model="form" @submit.prevent="onSubmit">
      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Email"
          type="email"
          autocomplete="email"
        ></v-text-field>
      </BaseInputWrapper>

      <br />

      <v-btn
        :disabled="!form"
        :loading="loading"
        block
        color="success"
        size="large"
        type="submit"
        variant="elevated"
      >
        Resend confirmation
      </v-btn>
    </v-form>
  </BaseFormWrapper>
</template>
