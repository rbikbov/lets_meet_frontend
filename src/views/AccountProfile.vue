<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import { AUTH_USER } from '@/services/queries/keys';
import { fetchUserInfo } from '@/services/auth';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseAvatarWrapper from '@/components/BaseAvatarWrapper.vue';

const { jwtPayload, user } = storeToRefs(useAuthStore());

const fetchMe = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchUserInfo(jwtPayload.value!.id),
});
</script>

<template>
  <div>
    <BaseFormWrapper v-if="user">
      <BaseAvatarWrapper v-slot="{ url }">
        <v-img :src="url" aspect-ratio="1" cover></v-img>
      </BaseAvatarWrapper>

      <br />

      <v-row dense>
        <v-col cols="9">
          <v-card-title>
            {{ user.first_name }}
            <br />
            {{ user.last_name }}
          </v-card-title>
        </v-col>

        <v-col cols="3">
          <v-row dense>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn
                icon="mdi-pencil"
                :to="{ name: AppRouteNames.accountProfileUpdate }"
                exact
                link
                small
                variant="text"
              ></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-card-subtitle> {{ user.email }} </v-card-subtitle>

      <v-card-subtitle> Age: {{ user.age }} </v-card-subtitle>

      <v-card-subtitle> Gender: {{ user.gender }} </v-card-subtitle>

      <!-- <v-divider></v-divider> -->

      <v-card-text></v-card-text>
    </BaseFormWrapper>
  </div>
</template>

<style></style>
