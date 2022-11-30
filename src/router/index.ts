import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export enum AppRouteNames {
  home = 'home',

  authSignin = 'authSignin',
  authSignout = 'authSignout',
  authSignup = 'authSignup',

  about = 'about',
  users = 'users',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '/',
          name: AppRouteNames.home,
          component: HomeView,
        },
        {
          path: '/auth/signin',
          name: AppRouteNames.authSignin,
          component: () => import('@/views/AuthSignin.vue'),
        },
        {
          path: '/auth/signout',
          name: AppRouteNames.authSignout,
          component: () => import('@/views/AuthSignout.vue'),
        },
        {
          path: '/auth/signup',
          name: AppRouteNames.authSignup,
          component: () => import('@/views/AuthSignup.vue'),
        },
        {
          path: '/about',
          name: AppRouteNames.about,
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/users',
          name: AppRouteNames.users,
          component: () => import('../views/UsersList.vue'),
        },
      ],
    },
  ],
});

export default router;
