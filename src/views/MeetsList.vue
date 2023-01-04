<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

import { useMeetsStore } from '@/stores/meets';
import { MEETS } from '@/services/queries/keys';
import { fetchMeets, initiateMeet } from '@/services/meets';
import { GenderType, FetchMeetsParams } from '@/services/api';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';
import GoldUsersList from '@/components/GoldUsersList.vue';
import BaseLoader from '@/components/BaseLoader.vue';

const { meets } = storeToRefs(useMeetsStore());
const { setMeets } = useMeetsStore();

const meetsQueryParams = ref<FetchMeetsParams>({
  search: {
    age_min: 0,
    age_max: 99,
    gender: undefined,
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

const initiateMeetMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) => initiateMeet(id).then(() => id),
  onSuccess: (id) => {
    console.log(`likePerson(${id})`);
  },
});
</script>

<template>
  <v-container fluid>
    <GoldUsersList />

    <br />

    <v-divider></v-divider>

    <br />

    <v-row>
      <v-col cols="3">
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
              label="Gender"
              :readonly="meetsQuery.isLoading.value"
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
            :disabled="meetsQuery.isLoading.value || !meetsFiltersFormIsValid"
            :loading="meetsQuery.isLoading.value"
            block
            size="large"
            type="submit"
            variant="outlined"
          >
            Fetch meets
          </v-btn>
        </v-form>
      </v-col>

      <v-col cols="9">
        <v-row>
          <v-col v-for="user in meets" :key="user.id" :cols="3">
            <v-card variant="outlined" elevation="8">
              <BaseDefaultAvatarWrapper
                v-slot="{ url, onError }"
                :avatar-url="user.avatar"
              >
                <v-img
                  :src="url"
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.9)"
                  cover
                  height="300px"
                  @error="onError"
                >
                  <template v-slot:placeholder>
                    <BaseLoader />
                  </template>

                  <div class="d-flex">
                    <div class="flex-grow-1 mb-4">
                      <v-card-title class="text-white">{{
                        user.first_name
                      }}</v-card-title>

                      <v-card-subtitle class="text-white">{{
                        `${user.gender}, ${user.age}`
                      }}</v-card-subtitle>

                      <v-card-subtitle v-if="user.city" class="text-white">{{
                        user.city
                      }}</v-card-subtitle>
                    </div>

                    <v-card-actions class="mt-auto">
                      <v-spacer></v-spacer>

                      <v-btn
                        v-if="user.initiated_him"
                        size="small"
                        color="surface-variant"
                        variant="text"
                        disabled
                        icon="mdi-heart"
                      ></v-btn>
                      <v-btn
                        v-else
                        size="small"
                        color="surface-variant"
                        variant="text"
                        icon="mdi-heart-outline"
                        :loading="initiateMeetMutation.isLoading.value"
                        @click="initiateMeetMutation.mutate(user.id)"
                      ></v-btn>

                      <!--
                      <v-btn
                        size="small"
                        color="surface-variant"
                        variant="text"
                        icon="mdi-bookmark"
                      ></v-btn>

                      <v-btn
                        size="small"
                        color="surface-variant"
                        variant="text"
                        icon="mdi-share-variant"
                      ></v-btn>
                      -->
                    </v-card-actions>
                  </div>
                </v-img>
              </BaseDefaultAvatarWrapper>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
