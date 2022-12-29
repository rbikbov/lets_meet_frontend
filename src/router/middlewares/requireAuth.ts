import type { NavigationGuardNext } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

export async function requireAuth({ next }: { next: NavigationGuardNext }) {
  try {
    const authStore = useAuthStore();

    // const response = await getMeFn();
    // const user = response.data.user;
    // authStore.setAuthUser(user);

    if (!authStore.isAuthenticated) {
      console.log('requireAuth', {
        isAuthenticated: authStore.isAuthenticated,
      });
      return next({
        name: AppRouteNames.authSignin,
      });
    }
  } catch (error) {
    console.error('requireAuth', error);
    document.location.href = '/auth/signin';
  }

  return next();
}
