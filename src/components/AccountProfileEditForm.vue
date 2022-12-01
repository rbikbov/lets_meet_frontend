<template>
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="firstName"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Firstname"
          type="text"
          autocomplete="first-name"
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Lastname"
          type="text"
          autocomplete="last-name"
        ></v-text-field>

        <br />

        <v-text-field
          v-model="age"
          :readonly="loading"
          :rules="[required, min(16), max(60)]"
          :min="16"
          :max="60"
          clearable
          label="age"
          type="text"
        ></v-text-field>

        <!-- <v-slider
          v-model.number="age"
          :readonly="loading"
          :rules="[required, min(16), max(60)]"
          :min="16"
          :max="60"
          label="Age"
          type="number"
          step="1"
          thumb-label="always"
        ></v-slider> -->

        <br />

        <v-btn
          :disabled="formNotChanged && !form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Save
        </v-btn>

        <br />

        <v-btn
          :loading="loading"
          block
          color="error"
          size="large"
          type="button"
          variant="elevated"
          @click="onCancel"
        >
          Cancel
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ProfileDataUser } from '@/services/api';

const props = withDefaults(
  defineProps<{
    loading: boolean;
    user: {
      first_name?: ProfileDataUser['first_name'];
      last_name?: ProfileDataUser['last_name'];
      age?: ProfileDataUser['age'];
    };
  }>(),
  {
    loading: false,
    user: () => ({
      first_name: '',
      last_name: '',
      age: 18,
    }),
  }
);

const emits = defineEmits({
  submit(payload: ProfileDataUser) {
    if (payload.first_name && payload.last_name && payload.age) {
      return true;
    } else {
      console.warn(`Invalid submit event payload!`);
      return false;
    }
  },
  cancel: null,
});

const form = ref(false);
const firstName = ref(props.user?.first_name || '');
const lastName = ref(props.user?.last_name || '');
const age = ref(props.user?.age || 18);

const formNotChanged = computed(() => {
  return (
    firstName.value === props.user?.first_name &&
    lastName.value === props.user?.last_name &&
    age.value === props.user?.age
  );
});

watch(props, ({ user }) => {
  form.value = false;
  firstName.value = user?.first_name || '';
  lastName.value = user?.last_name || '';
  age.value = user?.age || 18;
});

const onSubmit = () => {
  if (props.loading) return;
  if (!form.value) return;

  emits('submit', {
    first_name: firstName.value,
    last_name: lastName.value,
    age: age.value,
  });
};

const onCancel = () => {
  emits('cancel');
};

const required = (v: string) => {
  return !!v || 'Field is required';
};

const min = (minValue: number) => {
  return (currentValue: number) => {
    return (
      minValue <= currentValue || `Field should be greater than ${minValue}`
    );
  };
};
const max = (maxValue: number) => {
  return (currentValue: number) => {
    return maxValue >= currentValue || `Field should be less than ${maxValue}`;
  };
};
</script>
