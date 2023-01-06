<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import { useIsFetching } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { RouteLocationNamedRaw, RouterView } from 'vue-router';
import { usePreferredDark } from '@vueuse/core';

import { useAuthStore } from '@/stores/auth';
import { AppRouteNames } from '@/router';

import AppSnackbars from '@/components/AppSnackbars.vue';
import { VIcon } from 'vuetify/components';
import { useRightDrawerRoutingStore } from '@/stores/rightDrawerRouting';

const isFetching = useIsFetching();

const { authUser, isAuthenticated } = storeToRefs(useAuthStore());
// const userTitle = computed(() =>
//   isAuthenticated.value ? authUser.value?.email : 'Anonymous'
// );

const prefersDark = usePreferredDark();
const isDark = ref(prefersDark);
const theme = computed(() => (isDark.value ? 'dark' : 'light'));
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

interface AppBarNavLink {
  title?: string;
  to: RouteLocationNamedRaw & { name: AppRouteNames };
  // to: { name: AppRouteNames };
  link: true;
  exact: true;
  meta: {
    visibleForAuth: boolean;
    visibleForNotAuth: boolean;
    disabled?: boolean;
  };
  extraProps: VIcon['$props'];
}

const appBarNavLinks: AppBarNavLink[] = [
  {
    title: 'SignUp',
    to: { name: AppRouteNames.authSignup },
    link: true,
    exact: true,
    meta: {
      visibleForAuth: false,
      visibleForNotAuth: true,
    },
    extraProps: {
      icon: 'mdi-account-plus-outline',
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
      disabled: true,
    },
    extraProps: {
      icon: 'mdi-email-fast-outline',
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
    extraProps: {
      icon: 'mdi-login-variant',
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
      disabled: true,
    },
    extraProps: {
      icon: 'mdi-account-multiple-plus',
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
    extraProps: {
      icon: 'mdi-bell-outline' || 'mdi-bell-badge-outline',
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
    extraProps: {
      icon: 'mdi-forum-outline',
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
    extraProps: {
      icon: 'mdi-account-outline',
    },
  },
];

const filteredAppBarNavLinks = computed(() =>
  appBarNavLinks.filter(
    (l) =>
      !l.meta.disabled &&
      ((isAuthenticated.value && l.meta.visibleForAuth) ||
        (!isAuthenticated.value && l.meta.visibleForNotAuth))
  )
);

const { to: rightDrawerTo, matchedRoute: rightDrawerRoute } = storeToRefs(
  useRightDrawerRoutingStore()
);

const { close: closeRightDrawer } = useRightDrawerRoutingStore();

const rightDrawerComponent = computed(() =>
  rightDrawerRoute.value?.components?.default
    ? defineAsyncComponent({
        // @ts-ignore
        loader: rightDrawerRoute.value.components.default,
      })
    : null
);
const rightDrawerComponentProps = computed(() => {
  const propsDefault = rightDrawerRoute.value?.props.default;
  const isFunc = propsDefault && typeof propsDefault === 'function';
  return propsDefault && isFunc
    ? propsDefault(rightDrawerTo.value)
    : propsDefault;
});
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-btn
        :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme"
      ></v-btn>

      <v-app-bar-title>Let's Meet</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-progress-circular
          :indeterminate="!!isFetching"
        ></v-progress-circular>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-for="navLink in filteredAppBarNavLinks"
        :key="navLink.to.name"
        :to="navLink.to"
        link
        :icon="!navLink.title"
        :prepend-icon="navLink.title ? navLink.extraProps.icon : undefined"
        exact
      >
        <v-icon v-if="!navLink.title" :icon="navLink.extraProps.icon"></v-icon>
        <template v-if="navLink.title">{{ navLink.title }}</template>
      </v-btn>
    </v-app-bar>

    <keep-alive>
      <v-navigation-drawer
        :model-value="!!rightDrawerRoute"
        permanent
        location="right"
        width="600"
      >
        <v-col
          v-if="rightDrawerRoute"
          cols="auto"
          class="d-flex align-center"
          style="position: absolute; right: 4px; top: 4px; height: 64px"
        >
          <v-btn icon size="30" variant="outlined" @click="closeRightDrawer">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-col>

        <component
          v-if="rightDrawerRoute"
          :is="rightDrawerComponent"
          v-bind="rightDrawerComponentProps"
          :key="rightDrawerRoute.path"
        />
      </v-navigation-drawer>
    </keep-alive>

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
