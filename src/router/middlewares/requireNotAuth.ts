import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

export async function requireNotAuth({
  next,
  from,
}: {
  next: NavigationGuardNext;
  from: RouteLocationNormalized;
}) {
  try {
    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
      console.log('requireNotAuth', {
        isAuthenticated: authStore.isAuthenticated,
        from,
      });
      return next({
        name: AppRouteNames.home,
      });
    }
  } catch (error) {
    console.error('requireNotAuth', error);
    document.location.href = '/';
  }

  return next();
}
