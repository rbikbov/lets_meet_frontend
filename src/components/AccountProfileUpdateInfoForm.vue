<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { type ProfileDataUser, GenderType } from '@/services/api';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    initialData: ProfileDataUser;
  }>(),
  {
    loading: false,
  }
);

const emits = defineEmits({
  submit(payload: ProfileDataUser) {
    if (Object.values(payload).every(Boolean)) {
      return true;
    } else {
      console.warn(`Invalid submit event payload!`);
      return false;
    }
  },
  cancel: null,
});

const formIsValid = ref(false);
const formData = ref<ProfileDataUser>({ ...props.initialData });

const formNotChanged = computed(() => {
  return (
    props.initialData &&
    (Object.keys(formData.value) as Array<keyof typeof formData.value>).every(
      (key) => formData.value[key] === (props.initialData || {})[key]
    )
  );
});

watch(props, ({ initialData }) => {
  formData.value = {
    ...formData.value,
    ...initialData,
  };
});

const onSubmit = () => {
  if (props.loading) return;
  if (!formIsValid.value) return;
  if (formNotChanged.value) return;

  emits('submit', formData.value);
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

<template>
  <BaseFormWrapper>
    <v-form v-model="formIsValid" @submit.prevent="onSubmit">
      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model="formData.first_name"
          :readonly="loading"
          :rules="[required]"
          label="Firstname"
          type="text"
          autocomplete="first-name"
        ></v-text-field>
      </BaseInputWrapper>

      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model="formData.last_name"
          :readonly="loading"
          :rules="[required]"
          label="Lastname"
          type="text"
          autocomplete="last-name"
        ></v-text-field>
      </BaseInputWrapper>

      <BaseInputWrapper v-slot="{ inputProps }">
        <v-text-field
          v-bind="inputProps"
          v-model.number="formData.age"
          :readonly="loading"
          :rules="[required, min(16), max(60)]"
          :min="16"
          :max="60"
          label="Age"
          type="number"
        ></v-text-field>
      </BaseInputWrapper>

      <BaseInputWrapper v-slot="{ inputProps }">
        <v-radio-group
          v-bind="inputProps"
          v-model="formData.gender"
          :readonly="loading"
          label="Gender"
          :rules="[required]"
        >
          <v-radio label="Female" :value="GenderType.Female"></v-radio>
          <v-radio label="Male" :value="GenderType.Male"></v-radio>
        </v-radio-group>
      </BaseInputWrapper>

      <br />

      <v-btn
        :disabled="formNotChanged"
        :loading="loading"
        block
        size="large"
        type="submit"
        variant="outlined"
      >
        Save
      </v-btn>

      <br />

      <v-btn
        :loading="loading"
        block
        size="large"
        type="button"
        variant="outlined"
        @click="onCancel"
      >
        Cancel
      </v-btn>
    </v-form>
  </BaseFormWrapper>
</template>
