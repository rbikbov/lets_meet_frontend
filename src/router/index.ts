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
  home = 'meets',

  authSignin = 'authSignin',
  authSignup = 'authSignup',
  authSignupThanks = 'authSignupThanks',
  authSignupConfirmation = 'authSignupConfirmation',
  authSignupConfirmationResend = 'authSignupConfirmationResend',

  accountProfile = 'accountProfile',
  accountProfileUpdateInfo = 'accountProfileUpdateInfo',
  accountProfileUpdateAvatar = 'accountProfileUpdateAvatar',

  meets = 'meets',

  notifications = 'notifications',

  dialogs = 'dialogs',
  dialogDetail = 'dialogDetail',
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
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      middlewares: [],
    },
    children: [
      {
        path: '/',
        // name: AppRouteNames.home,
        redirect: AppRouteNames.meets,
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
        path: '/auth/signup-confirmation/:confirmationCode+',
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
        path: '/auth/signup-confirmation-resend',
        name: AppRouteNames.authSignupConfirmationResend,
        component: () => import('@/views/AuthSignupConfirmationResend.vue'),
        meta: {
          middlewares: [requireNotAuth],
        },
      },

      {
        path: '/account/profile',
        name: AppRouteNames.accountProfile,
        component: () => import('@/views/AccountProfile.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/account/profile-update-info',
        name: AppRouteNames.accountProfileUpdateInfo,
        component: () => import('@/views/AccountProfileUpdateInfo.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/account/profile-update-avatar',
        name: AppRouteNames.accountProfileUpdateAvatar,
        component: () => import('@/views/AccountProfileUpdateAvatar.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/meets',
        name: AppRouteNames.meets,
        component: () => import('@/views/MeetsList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/notifications',
        name: AppRouteNames.notifications,
        component: () => import('@/views/NotificationsList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/dialogs',
        name: AppRouteNames.dialogs,
        component: () => import('@/views/DialogsList.vue'),
        meta: {
          middlewares: [requireAuth],
        },
      },

      {
        path: '/dialogs/:id(\\d+)+',
        name: AppRouteNames.dialogDetail,
        component: () => import('@/views/DialogDetail.vue'),
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
