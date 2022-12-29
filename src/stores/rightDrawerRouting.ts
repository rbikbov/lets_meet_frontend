import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { RouteLocationNormalized, useRouter } from 'vue-router';

export const useRightDrawerRoutingStore = defineStore(
  'rightDrawerRouting',
  () => {
    const router = useRouter();

    const getMatchedRoute = (route: Partial<RouteLocationNormalized>) => {
      const matched = router.resolve(route as RouteLocationNormalized).matched;

      if (matched.length) {
        return matched[matched.length - 1];
      }

      return null;
    };

    const to = ref<Partial<RouteLocationNormalized> | null>(null);
    const matchedRoute = computed(() => {
      if (!to.value) {
        return null;
      }

      return getMatchedRoute(to.value);
    });

    watch(
      () => to.value,
      (newVal) => {
        if (newVal) {
          localStorage.setItem(
            'rightDrawerTo',
            JSON.stringify({
              path: newVal.path,
              name: newVal.name,
              params: newVal.params,
              query: newVal.query,
            })
          );
        } else {
          localStorage.removeItem('rightDrawerTo');
        }
      }
    );

    try {
      // @ts-ignore
      to.value = JSON.parse(localStorage.getItem('rightDrawerTo'));
    } catch {
      close();
    }

    if (!to.value || !matchedRoute.value) {
      close();
    }

    function setTo(newTo: RouteLocationNormalized | null) {
      if (to.value?.path === newTo?.path) {
        to.value = null;
      } else {
        to.value = newTo;
      }
    }

    function close() {
      setTo(null);
    }

    return {
      to,
      matchedRoute,

      setTo,
      close,
    };
  }
);
