import { BuiltRoute, PipeClass } from "../types";
import { router } from "../pipeline/router";

/** Register routes in express + attach lifecycle */
export function registerRoutes(app: any, routes: BuiltRoute[]) {
  const globalPipes: PipeClass[] = [];
  const globalGuards: any[] = [];

  const useGlobalPipes = (pipes: PipeClass[]) => globalPipes.push(...(pipes ?? []));
  const useGlobalGuards = (guards: any[]) => globalGuards.push(...(guards ?? []));

  for (const r of routes) {
    console.log(
        `[APP] Register route: [${r.method}] ${r.fullPath} -> ${r.controllerCtor.name}.${String(
            r.handlerName,
        )}`,
    );

    const expressMethod = r.method.toLowerCase();
    if (typeof app[expressMethod] !== "function") {
      throw new Error(`[APP] Unsupported HTTP method: ${r.method} (no app.${expressMethod}())`);
    }

    app[expressMethod](r.fullPath, async (req: any, res: any, next: any) => {
      console.log(
          `\n[REQ] Incoming ${req.method} ${req.path} -> ${r.controllerCtor.name}.${String(
              r.handlerName,
          )}`,
      );

      await router({
        req,
        res,
        next,
        controllerCtor: r.controllerCtor,
        controllerInstance: r.controllerInstance,
        handlerName: r.handlerName,
        globalPipes,
        globalGuards,
      });
    });
  }

  return {
    useGlobalPipes,
    useGlobalGuards,
  };
}
