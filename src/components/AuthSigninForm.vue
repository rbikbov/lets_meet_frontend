<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import type { SigninRequestDataUser } from '@/services/api';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import InputTypePassword from '@/components/InputTypePassword.vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  emits: {
    submit: (payload: SigninRequestDataUser) => {
      if (payload.email && payload.password) {
        return true;
      } else {
        console.warn(`Invalid submit event payload!`);
        return false;
      }
    },
  },

  components: {
    BaseFormWrapper,
    BaseInputWrapper,
    InputTypePassword,
  },

  data: () => ({
    form: false,
    email: '',
    password: '',
  }),

  methods: {
    onSubmit() {
      if (!this.form) return;

      this.$emit('submit', {
        email: this.email,
        password: this.password,
      });
    },
    required(v: string) {
      return !!v || 'Field is required';
    },
  },
});
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
        <InputTypePassword
          v-bind="inputProps"
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          autocomplete="password"
          placeholder="Enter your password"
        >
        </InputTypePassword>
      </BaseInputWrapper>

      <br />

      <v-btn
        :disabled="!form"
        :loading="loading"
        block
        size="large"
        type="submit"
        variant="outlined"
      >
        Login
      </v-btn>
    </v-form>
  </BaseFormWrapper>
</template>
