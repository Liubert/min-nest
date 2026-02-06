import { RouteLifecycleContext } from "../types";
import { runFilters } from "./lifecycle/runFilters";
import { runGuardsOrThrow } from "./lifecycle/runGuards";
import { runInterceptorsBefore, runInterceptorsAfter } from "./lifecycle/runInterceptors";
import { buildHandlerArgsWithPipes } from "./buildHandlerArguments";

export async function router(ctx: RouteLifecycleContext): Promise<void> {
  const handlerLabel = `${ctx.controllerCtor.name}.${String(ctx.handlerName)}`;

  try {
    console.log(
        `\n[NEST-LIFECYCLE] === Incoming Request: ${ctx.req.method} ${ctx.req.url} ===`,
    );

    // 1) Pipes (включно з глобальними)
    const args = await buildHandlerArgsWithPipes(ctx);

    // 2) Guards (включно з глобальними) ✅ FIX HERE
    await runGuardsOrThrow(ctx, ctx.globalGuards);

    // 3) Interceptors (Before)
    console.log(`[NEST-LIFECYCLE] Phase: Interceptors (Before)`);
    await runInterceptorsBefore(ctx);

    // 4) Handler
    console.log(`[NEST-LIFECYCLE] Phase: Route Handler [${handlerLabel}]`);
    const handler = ctx.controllerInstance[ctx.handlerName].bind(ctx.controllerInstance);
    let result = await handler(...args);

    // 5) Interceptors (After)
    console.log(`[NEST-LIFECYCLE] Phase: Interceptors (After)`);
    result = await runInterceptorsAfter(ctx, result);

    // 6) Response
    ctx.res.json(result);
    console.log(`[NEST-LIFECYCLE] === Finalizing Response: 200 OK ===\n`);
  } catch (err) {
    console.error(`[NEST-LIFECYCLE] Exception caught at: ${handlerLabel}`);
    await runFilters(ctx, err);
  }
}
