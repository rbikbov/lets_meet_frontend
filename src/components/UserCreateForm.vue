<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>

        <v-text-field
          v-model="password_confirmation"
          :readonly="loading"
          :rules="[required, isEqual({ field: 'password', value: password })]"
          clearable
          label="Password confirm"
          placeholder="Enter your password again"
        ></v-text-field>

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
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VSheet, VCard, VForm, VTextField, VBtn } from 'vuetify/components';

import type { AuthSignupRequest } from '@/types/api/authSignupRequest';

export default defineComponent({
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  emits: {
    submit: (payload: AuthSignupRequest) => {
      if (payload.email && payload.password && payload.password_confirmation) {
        return true;
      } else {
        console.warn(`Invalid submit event payload!`);
        return false;
      }
    },
  },

  components: {
    VSheet,
    VCard,
    VForm,
    VTextField,
    VBtn,
  },

  data: () => ({
    form: false,
    email: '',
    password: '',
    password_confirmation: '',
  }),

  methods: {
    onSubmit() {
      if (!this.form) return;

      this.$emit('submit', {
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      });
    },
    required(v: string) {
      return !!v || 'Field is required';
    },
    isEqual({ field, value }: { field: string; value: string }) {
      return (currentValue: string) => {
        return value === currentValue || `Field is not equal to ${field}`;
      };
    },
  },
});
</script>
