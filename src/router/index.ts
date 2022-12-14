import {
  createRouter,
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

  meets = 'meets',

  dialogs = 'dialogs',
  dialogDetail = 'dialogDetail',

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
        path: '/meets',
        name: AppRouteNames.meets,
        component: () => import('../views/MeetsList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
      {
        path: '/dialogs',
        name: AppRouteNames.dialogs,
        component: () => import('../views/DialogsList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },
      {
        path: '/dialogs/:id', // TODO: int
        name: AppRouteNames.dialogDetail,
        component: () => import('../views/DialogDetail.vue'),
        meta: {
          middlewares: [requireAuth],
        },
        props: (route) => {
          const rawDialogId = route.params.id;
          if (!(typeof rawDialogId === 'string')) {
            throw new Error('Wrong param "id'); // TODO: error
          }

          const dialogId = parseInt(rawDialogId, 10);
          return {
            dialogId,
          };
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
  history: createWebHistory(import.meta.env.BASE_URL),
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
