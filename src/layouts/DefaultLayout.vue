<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIsFetching } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { usePreferredDark } from '@vueuse/core';

import { useAuthStore } from '@/stores/auth';
import { AppRouteNames } from '@/router';

import BaseAvatarWrapper from '@/components/BaseAvatarWrapper.vue';

const isFetching = useIsFetching();

const { user, isAuthenticated } = storeToRefs(useAuthStore());
const userTitle = computed(() =>
  isAuthenticated.value ? user.value?.email : 'Anonymous'
);

const prefersDark = usePreferredDark();
const isDark = ref(prefersDark);
const theme = computed(() => (isDark.value ? 'dark' : 'light'));
const toggleTheme = () => {
  isDark.value = !isDark.value;
};
</script>

<template>
  <v-app :theme="theme">
    <v-navigation-drawer rail permanent>
      <BaseAvatarWrapper v-slot="{ url }">
        <v-list-item nav :prepend-avatar="url"></v-list-item>
      </BaseAvatarWrapper>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          value="dashboard"
        ></v-list-item>

        <v-list-item prepend-icon="mdi-forum" value="messages"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item :title="userTitle" key="userTitle"></v-list-item>

        <v-divider></v-divider>

        <template v-if="!isAuthenticated">
          <v-list-item
            title="SignUp"
            value="signup"
            :to="{ name: AppRouteNames.authSignup }"
            :link="true"
            :exact="true"
          ></v-list-item>

          <v-list-item
            title="SignIn"
            value="signin"
            :to="{ name: AppRouteNames.authSignin }"
            :link="true"
            :exact="true"
          ></v-list-item>
        </template>
        <template v-else>
          <v-list-item
            title="SignOut"
            value="signout"
            :to="{ name: AppRouteNames.authSignout }"
            :link="true"
            :exact="true"
          ></v-list-item>

          <v-list-item
            title="Profile"
            value="profile"
            :to="{ name: AppRouteNames.accountProfile }"
            :link="true"
            :exact="true"
          ></v-list-item>

          <v-list-item
            title="Users"
            value="users"
            :to="{ name: AppRouteNames.users }"
            :link="true"
            :exact="true"
          ></v-list-item>
        </template>

        <v-list-item
          title="Home"
          value="home"
          :to="{ name: AppRouteNames.home }"
          :link="true"
          :exact="true"
        ></v-list-item>

        <v-list-item
          title="About"
          value="about"
          :to="{ name: AppRouteNames.about }"
          :link="true"
          :exact="true"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Base App Frontend">
      <v-spacer></v-spacer>

      <v-btn
        :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme"
      ></v-btn>

      <v-btn>
        <v-progress-circular
          :indeterminate="!!isFetching"
        ></v-progress-circular>
      </v-btn>
    </v-app-bar>

    <v-main>
      <RouterView v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </RouterView>
    </v-main>
  </v-app>
</template>
