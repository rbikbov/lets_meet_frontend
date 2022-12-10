<script setup lang="ts">
import { ref } from 'vue';

import type { SignupRequestDataUser } from '@/services/api';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const props = withDefaults(defineProps<{ loading: boolean }>(), {
  loading: false,
});

const emits = defineEmits({
  submit: (payload: SignupRequestDataUser) => {
    if (payload.email && payload.password && payload.password_confirmation) {
      return true;
    } else {
      console.warn(`Invalid submit event payload!`);
      return false;
    }
  },
});

const form = ref(false);
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const onSubmit = () => {
  if (props.loading) return;
  if (!form.value) return;

  emits('submit', {
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  });
};

const required = (v: string) => {
  return !!v || 'Field is required';
};

const isEqual = ({
  fieldName,
  fieldValue,
}: {
  fieldName: string;
  fieldValue: string;
}) => {
  return (currentValue: string) => {
    return fieldValue === currentValue || `Field is not equal to ${fieldName}`;
  };
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

      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          type="password"
          placeholder="Enter your password"
          autocomplete="password"
        ></v-text-field>
      </BaseInputWrapper>

      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model="password_confirmation"
          :readonly="loading"
          :rules="[
            required,
            isEqual({ fieldName: 'password', fieldValue: password }),
          ]"
          clearable
          label="Password confirm"
          type="password"
          placeholder="Enter your password again"
          autocomplete="none"
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
        Register
      </v-btn>
    </v-form>
  </BaseFormWrapper>
</template>
