import { Container } from "../../di-container";
import { getControllerPrefix, getRoutes } from "../../decorators";

import { BuiltRoute } from "../types";

function joinPaths(prefix: string, path: string) {
  const p = (prefix ?? "").trim();
  const r = (path ?? "").trim();

  const left = p.startsWith("/") ? p : `/${p}`;
  const right = r.startsWith("/") ? r : `/${r}`;

  return (left + right).replace(/\/{2,}/g, "/");
}

/** Part 1: scan controllers + build route table */
export function buildRoutes(controllers: any[]): BuiltRoute[] {
  const result: BuiltRoute[] = [];

  for (const Ctrl of controllers) {
    console.log(`[APP] Resolving controller: ${Ctrl.name}`);
    const instance = Container.resolve(Ctrl);

    const prefix = getControllerPrefix(Ctrl);
    const routes = getRoutes(Ctrl);

    console.log(
      `[APP] Controller ${Ctrl.name} prefix="${prefix}", routes=`,
      routes.map((r) => `${r.method} ${r.path} -> ${String(r.handlerName)}`),
    );

    for (const route of routes) {
      const fullPath = joinPaths(prefix, route.path);

      result.push({
        method: route.method,
        fullPath,
        controllerCtor: Ctrl,
        controllerInstance: instance,
        handlerName: route.handlerName,
      });
    }
  }

  return result;
}
