<script setup lang="ts">
import { ref } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';

import {
  MEETS_FETCH_CURRENT_PERSON,
  MEETS_UPDATE_PERSONS_PULL_BY_FILTER,
} from '@/services/queries/keys';
import type { UpdatePullPersonsByFilterParams, User } from '@/services/api';
import {
  updatePullPersonsByFilter,
  fetchCurrentPerson,
  initiateCurrentPerson,
  skipCurrentPerson,
} from '@/services/meets';

import GoldUsersList from '@/components/GoldUsersList.vue';
import MeetsFiltersForm from '@/components/MeetsFiltersForm.vue';
import MeetsGridCardItem from '@/components/MeetsGridCardItem.vue';

const meetsQueryParams = ref<UpdatePullPersonsByFilterParams>({
  search: {
    age_min: 18,
    age_max: 70,
    gender: undefined,
    city: '',
    // page: 1,
    // per: 25,
  },
});

const currentPerson = ref<User | null>(null);

const updatePullPersonsByFilterQuery = useQuery({
  queryKey: [MEETS_UPDATE_PERSONS_PULL_BY_FILTER],
  queryFn: () => updatePullPersonsByFilter(meetsQueryParams.value),
  onSuccess: (response) => {
    currentPerson.value = response.data;
  },
  enabled: false,
});

const fetchCurrentPersonQuery = useQuery({
  queryKey: [MEETS_FETCH_CURRENT_PERSON],
  queryFn: () => fetchCurrentPerson(),
  onSuccess: (response) => {
    // "Persons are empty! Try to change filter for search more persons"
    const isCurrentPersonNotExists = response.status === 204;

    if (isCurrentPersonNotExists) {
      updatePullPersonsByFilterQuery.refetch();
    } else {
      currentPerson.value = response.data;
    }
  },
});

const initiateCurrentPersonMutation = useMutation({
  // // mutationKey: [],
  mutationFn: (id: number) => {
    console.log(`initiateCurrentPerson(${id})`);
    return initiateCurrentPerson();
  },
  onSuccess: (response) => {
    currentPerson.value = response.data;
  },
});

const skipCurrentPersonMutation = useMutation({
  // mutationKey: [],
  mutationFn: (id: number) => {
    console.log(`skipCurrentPerson(${id})`);
    return skipCurrentPerson();
  },
  onSuccess: (response) => {
    currentPerson.value = response.data;
  },
});

const onMeetsFiltersFormSubmit = () => {
  updatePullPersonsByFilterQuery.refetch();
};
</script>

<template>
  <v-container fluid>
    <GoldUsersList />

    <br />

    <v-divider></v-divider>

    <br />

    <v-row>
      <v-col cols="3">
        <MeetsFiltersForm
          v-model="meetsQueryParams"
          class="pt-4 mb-4"
          :loading="updatePullPersonsByFilterQuery.isRefetching.value"
          @submit="onMeetsFiltersFormSubmit"
        />
      </v-col>

      <v-col cols="9">
        <pre v-if="false">{{ updatePullPersonsByFilterQuery }}</pre>
        <v-row v-if="currentPerson">
          <v-col cols="4" class="d-flex align-center justify-center">
            <v-btn
              size="100"
              color="surface-variant"
              variant="text"
              icon="mdi-close"
              :loading="skipCurrentPersonMutation.isLoading.value"
              @click="skipCurrentPersonMutation.mutate(currentPerson!.id)"
            ></v-btn>
          </v-col>
          <v-col cols="4" style="height: 500px">
            <MeetsGridCardItem :user="currentPerson"></MeetsGridCardItem>
          </v-col>
          <v-col cols="4" class="d-flex align-center justify-center">
            <v-btn
              size="100"
              color="surface-variant"
              variant="text"
              icon="mdi-heart-outline"
              :loading="initiateCurrentPersonMutation.isLoading.value"
              @click="initiateCurrentPersonMutation.mutate(currentPerson!.id)"
            ></v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
