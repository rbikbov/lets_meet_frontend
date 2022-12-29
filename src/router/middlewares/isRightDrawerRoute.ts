import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useRightDrawerRoutingStore } from '@/stores/rightDrawerRouting';

export async function isRightDrawerRoute({
  to,
  from,
  next,
}: {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
}) {
  const rightDrawerRoutingStore = useRightDrawerRoutingStore();

  try {
    rightDrawerRoutingStore.setTo(to);

    if (!from || !from.name) {
      next({ name: AppRouteNames.meets });
      return;
    }
  } catch (error) {
    console.error('isRightDrawer', error);
    rightDrawerRoutingStore.close();
  }

  return next(from);
}
