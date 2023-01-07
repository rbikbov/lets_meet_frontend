<script setup lang="ts">
import { ref, watch } from 'vue';

import { GenderType, FetchMeetsParams } from '@/services/api';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    modelValue: FetchMeetsParams;
  }>(),
  {
    loading: false,
  }
);

const emits = defineEmits({
  'update:modelValue'(val: FetchMeetsParams) {
    return !!val;
  },
  submit() {
    return true;
  },
});

const formIsValid = ref(false);
const meetsQueryParams = ref<FetchMeetsParams>(props.modelValue);

watch(meetsQueryParams, (val) => {
  emits('update:modelValue', val);
});

const agesRange = ref<number[]>([
  meetsQueryParams.value.search?.age_min!,
  meetsQueryParams.value.search?.age_max!,
]);

watch(agesRange, ([min, max]) => {
  meetsQueryParams.value.search!.age_min = min;
  meetsQueryParams.value.search!.age_max = max;
});

const onSubmit = () => {
  if (props.loading) return;
  if (!formIsValid.value) return;

  emits('submit');
};
</script>

<template>
  <v-form class="pt-4 mb-4" v-model="formIsValid" @submit.prevent="onSubmit">
    <BaseInputWrapper v-slot="{ inputProps }">
      <v-range-slider
        v-bind="inputProps"
        v-model="agesRange"
        :readonly="loading"
        :step="1"
        :min="16"
        :max="80"
        thumb-label="always"
        label="Age"
      ></v-range-slider>
    </BaseInputWrapper>

    <BaseInputWrapper v-slot="{ inputProps }">
      <v-radio-group
        v-bind="inputProps"
        label="Gender"
        :readonly="loading"
        :model-value="meetsQueryParams.search?.gender"
        @update:model-value="
          ($event: GenderType | null) =>
            (meetsQueryParams.search!.gender = $event || undefined)
        "
      >
        <v-radio
          label="All"
          :value-comparator="(v) => !v"
          :value="null"
        ></v-radio>
        <v-radio label="Female" :value="GenderType.Female"></v-radio>
        <v-radio label="Male" :value="GenderType.Male"></v-radio>
      </v-radio-group>
    </BaseInputWrapper>

    <v-btn
      :disabled="loading || !formIsValid"
      :loading="loading"
      block
      size="large"
      type="submit"
      variant="outlined"
    >
      Fetch meets
    </v-btn>
  </v-form>
</template>
