import "reflect-metadata";
import {INJECT_METADATA_KEY, INJECTABLE_METADATA_KEY, Token} from "../di-container";

export function Inject(token: Token): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existing: Record<number, Token> =
      Reflect.getMetadata(INJECT_METADATA_KEY, target) || {};

    existing[parameterIndex] = token;

    Reflect.defineMetadata(INJECT_METADATA_KEY, existing, target);
  };
}

export function Injectable() {
  return (target: any) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    return target;
  };
}
