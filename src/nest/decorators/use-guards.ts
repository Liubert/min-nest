import "reflect-metadata";

export interface CanActivate {
  canActivate(ctx: any): boolean | Promise<boolean>;
}

export type GuardClass = new (...args: any[]) => CanActivate;

const GUARDS_METADATA_KEY = Symbol("guards");

export function UseGuards(
  ...guards: GuardClass[]
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // method
      const existing =
        Reflect.getMetadata(GUARDS_METADATA_KEY, target, propertyKey) ?? [];
      Reflect.defineMetadata(
        GUARDS_METADATA_KEY,
        [...existing, ...guards],
        target,
        propertyKey,
      );
    } else {
      // class
      const existing = Reflect.getMetadata(GUARDS_METADATA_KEY, target) ?? [];
      Reflect.defineMetadata(
        GUARDS_METADATA_KEY,
        [...existing, ...guards],
        target,
      );
    }
  };
}

export function getGuardsMetadata(
  controllerCtor: any,
  handlerName: string | symbol,
): GuardClass[] {
  const classGuards: GuardClass[] =
    Reflect.getMetadata(GUARDS_METADATA_KEY, controllerCtor) ?? [];

  const methodGuards: GuardClass[] =
    Reflect.getMetadata(
      GUARDS_METADATA_KEY,
      controllerCtor.prototype,
      handlerName,
    ) ??
    Reflect.getMetadata(
      GUARDS_METADATA_KEY,
      controllerCtor.prototype[handlerName],
    ) ??
    [];

  return [...classGuards, ...methodGuards];
}
