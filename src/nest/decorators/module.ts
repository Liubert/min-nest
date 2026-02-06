import "reflect-metadata";

export interface ModuleMetadata {
  providers?: any[];
  controllers?: any[];
  imports?: any[];
  exports?: any[];
}

const MODULE_METADATA_KEY = Symbol("module:metadata");

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
  };
}

export function getModuleMetadata(moduleCtor: any): ModuleMetadata | undefined {
  return Reflect.getMetadata(MODULE_METADATA_KEY, moduleCtor);
}
