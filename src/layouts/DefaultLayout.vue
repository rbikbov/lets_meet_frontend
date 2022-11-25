<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import {
  VApp,
  VNavigationDrawer,
  VListItem,
  VDivider,
  VList,
  VAppBar,
  VSpacer,
  VBtn,
  VMain,
} from 'vuetify/components';

import { useAuthStore } from '@/stores/auth';

const DEFAULT_THEME = 'dark'; // 'light'

const { user, isAuthenticated } = storeToRefs(useAuthStore());
const userTitle = computed(() =>
  isAuthenticated.value ? user.value?.email : 'Anonymous'
);

const theme = ref(DEFAULT_THEME);

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <v-app :theme="theme">
    <v-navigation-drawer rail permanent>
      <v-list-item
        nav
        prepend-avatar="https://randomuser.me/api/portraits/men/75.jpg"
      ></v-list-item>

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
        <v-list-item
          title="SignUp"
          value="signup"
          :to="{ name: 'signup' }"
          :exact="true"
        ></v-list-item>

        <v-list-item
          title="SignIn"
          value="signin"
          :to="{ name: 'signin' }"
          :exact="true"
        ></v-list-item>

        <v-list-item
          title="SignOut"
          value="signout"
          :to="{ name: 'signout' }"
          :exact="true"
        ></v-list-item>

        <v-list-item
          title="Home"
          value="home"
          to="/"
          :exact="true"
        ></v-list-item>

        <v-list-item
          title="Users"
          value="users"
          :to="{ name: 'users' }"
          :exact="true"
        ></v-list-item>

        <v-list-item title="About" value="about" to="/about"></v-list-item>

        <!--
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Car Select">
      <div>{{ userTitle }}</div>

      <v-spacer></v-spacer>

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="toggleTheme"
        >Toggle Theme</v-btn
      >
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
