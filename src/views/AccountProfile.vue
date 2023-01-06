<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import { AUTH_USER } from '@/services/queries/keys';
import { fetchMe } from '@/services/auth';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseAuthUserAvatarWrapper from '@/components/BaseAuthUserAvatarWrapper.vue';
import AuthSignoutProvider from '@/components/AuthSignoutProvider.vue';
import BaseLoader from '@/components/BaseLoader.vue';

const { authUser } = storeToRefs(useAuthStore());

const fetchMeQuery = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchMe(),
});
</script>

<template>
  <div class="d-flex flex-column">
    <BaseFormWrapper v-if="authUser">
      <v-row dense>
        <v-col>
          <BaseAuthUserAvatarWrapper v-slot="{ url, onError }">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-img
                v-bind="props"
                class="mx-auto"
                cover
                :width="300"
                :src="url"
                @error="onError"
              >
                <template v-slot:placeholder>
                  <BaseLoader />
                </template>

                <v-overlay
                  :model-value="isHovering"
                  contained
                  scrim="#EEE"
                  class="align-center justify-center"
                  width="100%"
                  height="100%"
                >
                  <v-btn
                    link
                    :to="{ name: AppRouteNames.accountProfileUpdateAvatar }"
                    width="100%"
                    height="100%"
                    variant="plain"
                    color="black"
                  >
                    <v-icon icon="mdi-camera" size="180"></v-icon>
                  </v-btn>
                </v-overlay>
              </v-img>
            </v-hover>
          </BaseAuthUserAvatarWrapper>
        </v-col>
      </v-row>

      <br />

      <v-row dense>
        <v-col cols="9">
          <v-card-title>
            {{ authUser.first_name }}
            <br />
            {{ authUser.last_name }}
          </v-card-title>
        </v-col>

        <v-col cols="3">
          <v-row dense>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn
                icon="mdi-pencil"
                :to="{ name: AppRouteNames.accountProfileUpdateInfo }"
                exact
                link
                small
                variant="text"
              ></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-card-subtitle> {{ authUser.email }} </v-card-subtitle>

      <v-card-subtitle> Age: {{ authUser.age }} </v-card-subtitle>

      <v-card-subtitle> Gender: {{ authUser.gender }} </v-card-subtitle>

      <!-- <v-divider></v-divider> -->

      <v-card-text></v-card-text>
    </BaseFormWrapper>

    <AuthSignoutProvider>
      <template v-slot="{ loading, signOut }">
        <v-btn
          :loading="loading"
          class="ma-auto"
          size="large"
          type="submit"
          variant="outlined"
          prepend-icon="mdi-logout-variant"
          @click="signOut"
        >
          Sign Out
        </v-btn>
      </template>
    </AuthSignoutProvider>
  </div>
</template>

<style></style>
