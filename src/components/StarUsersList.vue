<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { STARS_LIST } from '@/services/queries/keys';
import { fetchStarsList } from '@/services/stars';

import MeetsGridCardItem from '@/components/MeetsGridCardItem.vue';

const model = ref(null);
watch(() => model.value, console.log);

const starsListQuery = useQuery({
  queryKey: [STARS_LIST],
  queryFn: () => fetchStarsList(),
});
</script>

<template>
  <v-sheet class="mx-auto" elevation="8">
    <v-slide-group v-model="model" class="pa-0" center-active show-arrows>
      <v-slide-group-item
        v-for="user in starsListQuery.data.value?.data.results"
        :key="user.id"
        v-slot="{ isSelected, toggle }"
      >
        <v-card
          :color="isSelected ? 'primary' : 'grey-lighten-1'"
          class="ma-2"
          height="120"
          width="90"
          @click="toggle"
        >
          <div
            class="d-flex flex-column fill-height align-center justify-center"
          >
            <MeetsGridCardItem :user="user" />
            <v-scale-transition>
              <v-icon
                v-if="isSelected"
                color="white"
                size="48"
                icon="mdi-close-circle-outline"
              ></v-icon>
            </v-scale-transition>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
