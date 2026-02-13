import { Container } from "../../../di-container";
import { RouteLifecycleContext } from "../../types";
import { getUseFilters } from "../../../decorators";

const DEFAULT_ERROR_MESSAGE = "Internal Server Error";
const DEFAULT_ERROR_STATUS_CODE = 500;

function resolveFilters(ctx: RouteLifecycleContext): any[] {
  const global = ctx.globalFilters ?? [];
  const controllerLevel = getUseFilters(ctx.controllerCtor) ?? [];
  const methodLevel = getUseFilters(ctx.handlerRef) ?? [];


  const list = [...global, ...controllerLevel, ...methodLevel];

  // Allow both class and instance
  return list.map((it: any) => (typeof it === "function" ? Container.resolve(it) : it));
}

export async function runFilters(ctx: RouteLifecycleContext, err: any) {
  const filters = resolveFilters(ctx);

  for (const f of filters) {
    if (typeof f?.catch !== "function") continue;

    await f.catch(err, ctx);

    // If filter already wrote response — stop
    if (ctx.res.headersSent) return;
  }

  // Fallback default behavior
  const message = typeof err?.message === "string" ? err.message : DEFAULT_ERROR_MESSAGE;
  const statusCode =
      Number(err?.status ?? err?.statusCode) || DEFAULT_ERROR_STATUS_CODE;

  console.error(`[FILTER] Unhandled error: ${message}`);

  ctx.res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: ctx.req.url,
  });
}
