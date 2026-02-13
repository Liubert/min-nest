import { Container } from "../../../di-container";
import { RouteLifecycleContext, NestInterceptor } from "../../types";
import { getUseInterceptors } from "../../../decorators/use-interceptor.decorator";

function resolveInterceptors(ctx: RouteLifecycleContext): NestInterceptor[] {
  const global = ctx.globalInterceptors ?? [];
  const controllerLevel = getUseInterceptors(ctx.controllerCtor) ?? [];
  const methodLevel = getUseInterceptors(ctx.handlerRef) ?? [];

  const list = [...global, ...controllerLevel, ...methodLevel];

  return list.map((it: any) =>
      typeof it === "function" ? Container.resolve(it) : it
  );
}

export async function runInterceptorsBefore(ctx: RouteLifecycleContext) {
  const interceptors = resolveInterceptors(ctx);

  for (const interceptor of interceptors) {
    if (interceptor.before) {
      await interceptor.before(ctx);
    }
  }
}

export async function runInterceptorsAfter(
    ctx: RouteLifecycleContext,
    result: any
) {
  const interceptors = resolveInterceptors(ctx);

  for (let i = interceptors.length - 1; i >= 0; i--) {
    const interceptor = interceptors[i];
    if (interceptor.after) {
      result = await interceptor.after(result, ctx);
    }
  }

  return result;
}
