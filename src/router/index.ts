import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import {
  middlewaresPipeline,
  type MiddlewareFn,
} from '@/router/middlewaresPipeline';
import { requireAuth } from '@/router/middlewares/requireAuth';
import { requireNotAuth } from '@/router/middlewares/requireNotAuth';

export enum AppRouteNames {
  home = 'home',

  authSignin = 'authSignin',
  authSignout = 'authSignout',
  authSignup = 'authSignup',
  authSignupThanks = 'authSignupThanks',
  authSignupConfirmation = 'authSignupConfirmation',

  accountProfile = 'accountProfile',
  accountProfileUpdate = 'accountProfileUpdate',

  about = 'about',
  users = 'users',
}

interface AppRouteMeta {
  middlewares: MiddlewareFn[];
}

type RouteRecordRawWithMeta = RouteRecordRaw & {
  meta: AppRouteMeta;
};

const routes: Readonly<RouteRecordRawWithMeta[]> = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    meta: {
      middlewares: [],
    },
    children: [
      {
        path: '/',
        name: AppRouteNames.home,
        component: () => import('@/views/HomeView.vue'),
        meta: {
          middlewares: [],
        },
      },
      {
        path: '/auth/signin',
        name: AppRouteNames.authSignin,
        component: () => import('@/views/AuthSignin.vue'),
        meta: {
          middlewares: [requireNotAuth],
        },
      },
      {
        path: '/auth/signout',
        name: AppRouteNames.authSignout,
        component: () => import('@/views/AuthSignout.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
      {
        path: '/auth/signup',
        name: AppRouteNames.authSignup,
        component: () => import('@/views/AuthSignup.vue'),
        meta: {
          middlewares: [requireNotAuth],
        },
      },
      {
        path: '/auth/signup-thanks',
        name: AppRouteNames.authSignupThanks,
        component: () => import('@/views/AuthSignupThanks.vue'),
        meta: {
          middlewares: [requireNotAuth],
        },
        props: (route) => {
          const email = route.query?.email || '';
          return {
            email,
          };
        },
      },
      {
        path: '/auth/signup-confirmation/:confirmationCode',
        name: AppRouteNames.authSignupConfirmation,
        component: () => import('@/views/AuthSignupConfirmation.vue'),
        meta: {
          middlewares: [],
        },
        props: (route) => {
          const confirmationCode = route.params.confirmationCode || '';
          return {
            confirmationCode,
          };
        },
      },
      {
        path: '/account/profile',
        name: AppRouteNames.accountProfile,
        component: () => import('../views/AccountProfile.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
      {
        path: '/account/profile-update',
        name: AppRouteNames.accountProfileUpdate,
        component: () => import('../views/AccountProfileUpdate.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
      {
        path: '/about',
        name: AppRouteNames.about,
        component: () => import('../views/AboutView.vue'),
        meta: {
          middlewares: [],
        },
      },
      {
        path: '/users',
        name: AppRouteNames.users,
        component: () => import('../views/UsersList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
    ],
  },
];

const router = createRouter({
  history:
    process.env.NODE_ENV === 'production'
      ? createWebHashHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const meta = to.meta as RouteLocationNormalized['meta'] | AppRouteMeta;

    if (
      !meta.middlewares ||
      !Array.isArray(meta.middlewares) ||
      !meta.middlewares.length
    ) {
      return next();
    }

    const context = {
      to,
      from,
      next,
    };

    return meta.middlewares[0]({
      ...context,
      next: middlewaresPipeline(context, meta.middlewares),
    });
  }
);

export default router;
