import "reflect-metadata";

const CONTROLLER_PREFIX = Symbol("controller_prefix");

export function Controller(prefix = ""): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(CONTROLLER_PREFIX, prefix, target);
  };
}

export function getControllerPrefix(ctrl: any): string {
  return Reflect.getMetadata(CONTROLLER_PREFIX, ctrl) ?? "";
}
