import "reflect-metadata";
import { PipeTransform } from "../http/types";

type PipeCtor = new (...args: any[]) => PipeTransform<any, any>;
type PipeInstance = PipeTransform<any, any>;
type PipeType = PipeCtor | PipeInstance;

export type Source = "params" | "query" | "body";

export type ParamPipeMeta = {
  source: Source;
  key?: string;
  pipe?: PipeType;
};

export type ParamPipesMeta = Record<number, ParamPipeMeta[]>;

export const PARAM_PIPES_METADATA = Symbol("param_pipes_metadata");

function pushMeta(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
  meta: ParamPipeMeta,
) {
  const method = target[propertyKey as any];
  const existing: ParamPipesMeta =
    Reflect.getMetadata(PARAM_PIPES_METADATA, method) || {};

  const list = existing[parameterIndex] || [];
  list.push(meta);
  existing[parameterIndex] = list;

  Reflect.defineMetadata(PARAM_PIPES_METADATA, existing, method);
}

export function Param(
  pipeOrKey?: PipeType | string,
  keyMaybe?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const pipe = typeof pipeOrKey === "string" ? undefined : pipeOrKey;
    const key = typeof pipeOrKey === "string" ? pipeOrKey : keyMaybe;

    pushMeta(target, propertyKey!, parameterIndex, {
      source: "params",
      key,
      pipe,
    });
  };
}

export function Query(
  pipeOrKey?: PipeType | string,
  keyMaybe?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const pipe = typeof pipeOrKey === "string" ? undefined : pipeOrKey;
    const key = typeof pipeOrKey === "string" ? pipeOrKey : keyMaybe;

    pushMeta(target, propertyKey!, parameterIndex, {
      source: "query",
      key,
      pipe,
    });
  };
}

export function Body(
  pipeOrKey?: PipeType | string,
  keyMaybe?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const pipe = typeof pipeOrKey === "string" ? undefined : pipeOrKey;
    const key = typeof pipeOrKey === "string" ? pipeOrKey : keyMaybe;

    pushMeta(target, propertyKey!, parameterIndex, {
      source: "body",
      key,
      pipe,
    });
  };
}

export function getParamPipesMeta(
  proto: any,
  methodName: string | symbol,
): ParamPipesMeta {
  const method = proto[methodName as any];
  return Reflect.getMetadata(PARAM_PIPES_METADATA, method) || {};
}
