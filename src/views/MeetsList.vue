<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

import { useMeetsStore } from '@/stores/meets';
import { MEETS } from '@/services/queries/keys';
import { confirmLikePerson, fetchMeets, likePerson } from '@/services/meets';
import { GenderType, V1MeetsListParams } from '@/services/api';
import { getFullName } from '@/helpers/fullName';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const { meets } = storeToRefs(useMeetsStore());
const { setMeets } = useMeetsStore();

const meetsQueryParams = ref<V1MeetsListParams>({
  search: {
    age_min: 0,
    age_max: 99,
    gender: GenderType.Male,
    // city: string;
    // page: number;
    // per: number;
  },
});

const meetsFiltersFormIsValid = ref(false);

const onMeetsFiltersFormSubmit = () => {
  if (!meetsFiltersFormIsValid.value) {
    return;
  }

  meetsQuery.refetch();
};

const agesRange = ref<number[]>([18, 70]);

watch(agesRange, ([min, max]) => {
  meetsQueryParams.value.search!.age_min = min;
  meetsQueryParams.value.search!.age_max = max;
});

const meetsQuery = useQuery({
  queryKey: [MEETS],
  queryFn: () => fetchMeets(meetsQueryParams.value),
  onSuccess: (response) => {
    setMeets(response.data || []);
  },
});

const likePersonMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) => likePerson(id).then(() => id),
  onSuccess: (id) => {
    console.log(`likePerson(${id})`);
  },
});

const confirmLikePersonMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) => confirmLikePerson(id).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
  },
});
</script>

<template>
  <v-container fluid>
    <v-form
      class="pt-4 mb-4"
      v-model="meetsFiltersFormIsValid"
      @submit.prevent="onMeetsFiltersFormSubmit"
    >
      <BaseInputWrapper v-slot="{ inputProps }">
        <v-range-slider
          v-bind="inputProps"
          v-model="agesRange"
          :readonly="meetsQuery.isLoading.value"
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
          v-model="meetsQueryParams.search!.gender"
          :readonly="meetsQuery.isLoading.value"
          label="Gender"
        >
          <v-radio label="Unknown" :value="null"></v-radio>
          <v-radio label="Female" :value="GenderType.Female"></v-radio>
          <v-radio label="Male" :value="GenderType.Male"></v-radio>
        </v-radio-group>
      </BaseInputWrapper>

      <v-btn
        :disabled="meetsQuery.isLoading.value || !meetsFiltersFormIsValid"
        :loading="meetsQuery.isLoading.value"
        block
        color="success"
        size="large"
        type="submit"
        variant="elevated"
      >
        Fetch meets
      </v-btn>
    </v-form>

    <v-divider></v-divider>

    <v-row dense>
      <v-col v-for="user in meets" :key="user.id" cols="12">
        <v-card
          :title="getFullName(user)"
          :subtitle="`${user.gender}, ${user.age}`"
          :text="`Meet likes: ${user.likes}`"
          :prepend-avatar="user.avatar"
        >
          <v-btn type="button" @click="likePersonMutation.mutate(user.id)">
            likePerson
          </v-btn>
          <v-btn
            type="button"
            @click="confirmLikePersonMutation.mutate(user.id)"
          >
            confirmLikePerson
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
