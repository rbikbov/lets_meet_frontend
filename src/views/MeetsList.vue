<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

import { useMeetsStore } from '@/stores/meets';
import { MEETS } from '@/services/queries/keys';
import type { FetchMeetsParams } from '@/services/api';
import { fetchMeets, initiateMeet } from '@/services/meets';

import GoldUsersList from '@/components/GoldUsersList.vue';
import MeetsFiltersForm from '@/components/MeetsFiltersForm.vue';
import MeetsGridCardItem from '@/components/MeetsGridCardItem.vue';

const { meets } = storeToRefs(useMeetsStore());
const { setMeets } = useMeetsStore();

const meetsQueryParams: FetchMeetsParams = reactive({
  search: {
    age_min: 18,
    age_max: 70,
    gender: undefined,
    city: '',
    // page: 1,
    // per: 25,
  },
});

const onMeetsFiltersFormSubmit = () => {
  meetsQuery.refetch();
};

const meetsQuery = useQuery({
  queryKey: [MEETS],
  queryFn: () => fetchMeets(meetsQueryParams),
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
        <MeetsFiltersForm
          v-model="meetsQueryParams"
          class="pt-4 mb-4"
          :loading="meetsQuery.isLoading.value"
          @submit="onMeetsFiltersFormSubmit"
        />
      </v-col>

      <v-col cols="9">
        <v-row>
          <v-col v-for="user in meets" :key="user.id" :cols="3">
            <MeetsGridCardItem :user="user">
              <template v-slot:actions>
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
              </template>
            </MeetsGridCardItem>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
