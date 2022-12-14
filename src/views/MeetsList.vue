<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

import { useMeetsStore } from '@/stores/meets';
import { MEETS } from '@/services/queries/keys';
import { confirmLikePerson, fetchMeets, likePerson } from '@/services/meets';
import { GenderType, V1MeetsListParams } from '@/services/api';

const { meets } = storeToRefs(useMeetsStore());
const { setMeets } = useMeetsStore();

const meetsQueryParams = ref<V1MeetsListParams>({
  search: {
    age_min: 0,
    age_max: 99,
    gender: GenderType.Male,
    // page: number;
    // per: number;
  },
});

const meetsQuery = useQuery({
  queryKey: [MEETS],
  queryFn: () => fetchMeets(meetsQueryParams.value),
  onSuccess: (response) => {
    setMeets(response.data.users || []);
  },
});

const likePersonMutation = useMutation({
  // queryKey: [MEETS_LIKE_PERSON],
  mutationFn: (id: number) => likePerson(id).then(() => id),
  onSuccess: (id) => {
    console.log(`likePerson(${id})`);
    // setMeets(response.data.users || []);
  },
});

const confirmLikePersonMutation = useMutation({
  // queryKey: [MEETS_LIKE_PERSON],
  mutationFn: (id: number) => confirmLikePerson(id).then(() => id),
  onSuccess: (id) => {
    console.log(`confirmLikePerson(${id})`);
    // setMeets(response.data.users || []);
  },
});
</script>

<template>
  <v-container fluid>
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="meetsQuery.refetch"
    >
      Fetch meets
    </v-btn>

    <v-row dense>
      <v-col v-for="meet in meets" :key="meet.id" cols="12">
        <v-card
          :title="meet.email"
          :subtitle="`Meet id is ${meet.id}`"
          :text="`Meet likes = ${meet.likes}`"
        >
          <v-btn type="button" @click="likePersonMutation.mutate(meet.id)">
            likePerson
          </v-btn>
          <v-btn
            type="button"
            @click="confirmLikePersonMutation.mutate(meet.id)"
          >
            confirmLikePerson
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
