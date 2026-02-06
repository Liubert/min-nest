import { Container } from "../di-container";
import { getModuleMetadata } from "../decorators";

type BootstrapResult = {
  controllers: any[];
  exportedProviders: any[];
};

/**
 * Bootstraps full module graph (imports tree) and registers providers in the Container.
 *
 * Important note for this homework implementation:
 * - Container is GLOBAL (singleton map), not per-module.
 * - So we register providers exactly once: when we visit a module.
 * - `exports` are still computed (useful later), but NOT re-registered.
 */
export async function bootstrapModule(ModuleClass: any) {
  const visited = new Set<any>();
  const cache = new Map<any, BootstrapResult>();

  const bootstrapOne = (Mod: any): BootstrapResult => {
    if (cache.has(Mod)) return cache.get(Mod)!;

    if (visited.has(Mod)) {
      // Circular module imports: stop recursion.
      return { controllers: [], exportedProviders: [] };
    }

    visited.add(Mod);

    const meta = getModuleMetadata(Mod);
    if (!meta) throw new Error(`${Mod.name} is not a module`);

    const controllers: any[] = [];

    // 1) Imports first (just traverse + collect controllers)
    for (const Imported of meta.imports ?? []) {
      const importedRes = bootstrapOne(Imported);
      controllers.push(...importedRes.controllers);
    }

    // 2) Register own providers (ONLY ONCE per module)
    for (const provider of meta.providers ?? []) {
      Container.register(provider, { useClass: provider });
    }

    // 3) Collect own controllers
    controllers.push(...(meta.controllers ?? []));

    // 4) Compute exports (kept for semantics / future use)
    const exportedProviders =
        (meta.exports?.length ? meta.exports : meta.providers) ?? [];

    const result: BootstrapResult = { controllers, exportedProviders };
    cache.set(Mod, result);
    return result;
  };

  const res = bootstrapOne(ModuleClass);

  return {
    controllers: res.controllers,
  };
}