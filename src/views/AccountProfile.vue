<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import { AUTH_USER } from '@/services/queries/keys';
import { fetchMe } from '@/services/auth';
import { getFullDateTime } from '@/helpers/dateFormatter';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseAuthUserAvatarWrapper from '@/components/BaseAuthUserAvatarWrapper.vue';
import AuthSignoutProvider from '@/components/AuthSignoutProvider.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import AccountPremiumActivateOrIncrease from '@/components/AccountPremiumActivateOrIncrease.vue';
import AccountStarsActivateOrIncrease from '@/components/AccountStarsActivateOrIncrease.vue';

const { authUser } = storeToRefs(useAuthStore());
const { setAuthUser } = useAuthStore();

const fetchMeQuery = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchMe(),
  onSuccess: (response) => {
    setAuthUser(response.data);
  },
});

const onPremiumClicked = (fn: () => Promise<void>) => {
  fn().then(() => fetchMeQuery.refetch());
};

const onStarsClicked = (fn: () => Promise<void>) => {
  fn().then(() => fetchMeQuery.refetch());
};

const formatExpiresBtnText = (date?: string) => {
  if (!date) {
    return 'Activate';
  }
  return Number(new Date(date)) > Date.now() ? 'Increase' : 'Activate';
};
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

      <v-card-subtitle> Email: {{ authUser.email }} </v-card-subtitle>

      <v-card-subtitle> Age: {{ authUser.age }} </v-card-subtitle>

      <v-card-subtitle> Gender: {{ authUser.gender }} </v-card-subtitle>

      <v-card-subtitle> City: {{ authUser.city }} </v-card-subtitle>

      <v-card-subtitle> Coins: {{ authUser.coins }} </v-card-subtitle>

      <v-card-subtitle>
        Premium expires:
        {{
          authUser.premium_expires
            ? getFullDateTime(authUser.premium_expires)
            : '-'
        }}
      </v-card-subtitle>

      <v-card-subtitle>
        Stars expires:
        {{
          authUser.stars_expires ? getFullDateTime(authUser.stars_expires) : '-'
        }}
      </v-card-subtitle>

      <!-- <v-divider></v-divider> -->

      <!-- <v-card-text></v-card-text> -->

      <v-card-actions class="d-flex flex-column">
        <v-btn
          class="mb-2"
          link
          exact
          prepend-icon="mdi-cash-plus"
          variant="outlined"
          :to="{ name: AppRouteNames.accountBuyCoins }"
        >
          Buy coins
        </v-btn>
        <AccountPremiumActivateOrIncrease v-slot="{ loading, onActivate }">
          <v-btn
            class="mb-2"
            link
            exact
            prepend-icon="mdi-cash-plus"
            variant="outlined"
            :loading="loading"
            @click="onPremiumClicked(onActivate)"
          >
            {{ formatExpiresBtnText(authUser.premium_expires) }}
            premium
          </v-btn>
        </AccountPremiumActivateOrIncrease>
        <AccountStarsActivateOrIncrease v-slot="{ loading, onActivate }">
          <v-btn
            link
            exact
            prepend-icon="mdi-cash-plus"
            variant="outlined"
            :loading="loading"
            @click="onStarsClicked(onActivate)"
          >
            {{ formatExpiresBtnText(authUser.stars_expires) }}
            stars
          </v-btn>
        </AccountStarsActivateOrIncrease>
      </v-card-actions>
    </BaseFormWrapper>

    <AuthSignoutProvider v-slot="{ loading, onSignOut }">
      <v-btn
        :loading="loading"
        class="ma-auto"
        size="large"
        type="submit"
        variant="outlined"
        prepend-icon="mdi-logout-variant"
        @click="onSignOut"
      >
        Sign Out
      </v-btn>
    </AuthSignoutProvider>
  </div>
</template>

<style></style>
