import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/signin',
          name: 'signin',
          component: () => import('@/views/AuthSignin.vue'),
        },
        {
          path: '/signup',
          name: 'signup',
          component: () => import('@/views/AuthSignup.vue'),
        },
        {
          path: '/signout',
          name: 'signout',
          component: () => import('@/views/AuthSignout.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/UsersList.vue'),
        },
      ],
    },
  ],
});

export default router;
