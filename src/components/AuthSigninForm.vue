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
          type="email"
          autocomplete="email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          type="password"
          autocomplete="password"
          placeholder="Enter your password"
        >
        </v-text-field>

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
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import type { SigninRequestDataUser } from '@/services/api';
import { defineComponent, type PropType } from 'vue';
import { VSheet, VCard, VForm, VTextField, VBtn } from 'vuetify/components';

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
