import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

type MiddlewareContext = {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext | MiddlewareFn;
};

export type MiddlewareFn = (
  context: MiddlewareContext
) => NavigationGuardNext | MiddlewareFn;

export function middlewaresPipeline(
  context: MiddlewareContext,
  middlewares: MiddlewareFn[],
  index: number = 1
) {
  const nextMiddleware = middlewares[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return () => {
    const nextPipeline = middlewaresPipeline(context, middlewares, index + 1);

    nextMiddleware({ ...context, next: nextPipeline });
  };
}
