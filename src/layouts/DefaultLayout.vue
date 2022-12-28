<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIsFetching } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { usePreferredDark } from '@vueuse/core';

import { useAuthStore } from '@/stores/auth';
import { AppRouteNames } from '@/router';

import AppSnackbars from '@/components/AppSnackbars.vue';

const isFetching = useIsFetching();

const { authUser, isAuthenticated } = storeToRefs(useAuthStore());
const userTitle = computed(() =>
  isAuthenticated.value ? authUser.value?.email : 'Anonymous'
);

const prefersDark = usePreferredDark();
const isDark = ref(prefersDark);
const theme = computed(() => (isDark.value ? 'dark' : 'light'));
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

type NavLinkItem = {
  title: string;
  to: { name: AppRouteNames };
  link: true;
  exact: true;
  meta: {
    visibleForAuth: boolean;
    visibleForNotAuth: boolean;
  };
};

const navLinks: NavLinkItem[] = [
  {
    title: 'SignUp',
    to: { name: AppRouteNames.authSignup },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: false,
      visibleForNotAuth: true,
    },
  },
  {
    title: 'SignUp Confirmation Resend',
    to: { name: AppRouteNames.authSignupConfirmationResend },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: false,
      visibleForNotAuth: true,
    },
  },
  {
    title: 'SignIn',
    to: { name: AppRouteNames.authSignin },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: false,
      visibleForNotAuth: true,
    },
  },
  {
    title: 'SignOut',
    to: { name: AppRouteNames.authSignout },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
  {
    title: 'Profile',
    to: { name: AppRouteNames.accountProfile },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
  {
    title: 'Meets',
    to: { name: AppRouteNames.meets },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
  {
    title: 'Notifications',
    to: { name: AppRouteNames.notifications },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
  {
    title: 'Dialogs',
    to: { name: AppRouteNames.dialogs },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
  {
    title: 'Users',
    to: { name: AppRouteNames.users },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: true,
      visibleForNotAuth: false,
    },
  },
];

const filteredNavLinks = computed(() =>
  navLinks.filter(
    (l) =>
      (isAuthenticated.value && l.meta.visibleForAuth) ||
      (!isAuthenticated.value && l.meta.visibleForNotAuth)
  )
);
</script>

<template>
  <v-app :theme="theme">
    <v-navigation-drawer rail permanent>
      <BaseAuthUserAvatarWrapper v-slot="{ url }">
        <v-list-item nav>
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="url" alt="Avatar" cover></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </BaseAuthUserAvatarWrapper>

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

        <v-list-item
          v-for="linkInfo in filteredNavLinks"
          :key="linkInfo.to.name"
          :title="linkInfo.title"
          :to="linkInfo.to"
          :link="linkInfo.link"
          :exact="linkInfo.exact"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Lets Meet">
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

    <AppSnackbars />
  </v-app>
</template>
