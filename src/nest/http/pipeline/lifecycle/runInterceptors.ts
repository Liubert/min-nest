import { Container } from "../../../di-container";
import { RequestTimeInterceptor } from "../../../../apps/interceptors/request-time.interceptor";
import { RouteLifecycleContext } from "../../types";

const globalInterceptors = [Container.resolve(RequestTimeInterceptor)];

export async function runInterceptorsBefore(
  ctx: RouteLifecycleContext,
): Promise<void> {
  console.log(`[INTERCEPTOR] BEFORE: count=${globalInterceptors.length}`);

  for (const interceptor of globalInterceptors) {
    if (interceptor.before) {
      console.log(`[INTERCEPTOR] BEFORE -> ${interceptor.constructor.name}`);
      await interceptor.before(ctx);
    } else {
      console.log(
        `[INTERCEPTOR] BEFORE -> ${interceptor.constructor.name} (no before)`,
      );
    }
  }
}

export async function runInterceptorsAfter(
  ctx: RouteLifecycleContext,
  result: any,
): Promise<any> {
  console.log(`[INTERCEPTOR] AFTER: count=${globalInterceptors.length}`);

  for (let i = globalInterceptors.length - 1; i >= 0; i--) {
    const interceptor = globalInterceptors[i];
    if (interceptor.after) {
      console.log(`[INTERCEPTOR] AFTER -> ${interceptor.constructor.name}`);
      result = await interceptor.after(result, ctx);
    } else {
      console.log(
        `[INTERCEPTOR] AFTER -> ${interceptor.constructor.name} (no after)`,
      );
    }
  }
  return result;
}
