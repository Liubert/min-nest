import { RouteLifecycleContext } from "../../types";
import { CanActivate, getGuardsMetadata } from "../../../decorators";
import { Container } from "../../../di-container";
import { ForbiddenException } from "../../../errors/http-exception";


export async function runGuardsOrThrow(
    ctx: RouteLifecycleContext,
    globalGuards: any[] = [],
): Promise<void> {
  const handlerLabel = `${ctx.controllerCtor.name}.${String(ctx.handlerName)}`;

  // Local guards from decorators
  const localGuardCtors = getGuardsMetadata(ctx.controllerCtor, ctx.handlerName) ?? [];

  // Order: Global -> Local
  const guardCtors = [...(globalGuards ?? []), ...localGuardCtors];

  if (!guardCtors.length) return;

  for (const GuardCtor of guardCtors) {
    const guardInstance = Container.resolve<CanActivate>(GuardCtor);
    const allowed = await guardInstance.canActivate(ctx);

    if (!allowed) {
      throw new ForbiddenException(`Access denied by ${GuardCtor.name} for ${handlerLabel}`);
    }
  }
}
