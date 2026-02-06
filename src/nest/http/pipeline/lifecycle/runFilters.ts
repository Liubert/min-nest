import { RouteLifecycleContext } from "../../types";


const DEFAULT_ERROR_MESSAGE = "Internal Server Error";
const DEFAULT_ERROR_STATUS_CODE = 500;

export async function runFilters(ctx: RouteLifecycleContext, err: any) {
  const message = err?.message || DEFAULT_ERROR_MESSAGE;
  const statusCode = err.status || DEFAULT_ERROR_STATUS_CODE;

  console.error(`[FILTER] Handled error: ${message}`);

  ctx.res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: ctx.req.url,
  });
}
