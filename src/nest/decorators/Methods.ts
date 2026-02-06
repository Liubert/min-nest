import "reflect-metadata";
import { HttpMethod } from "../http/types";

const ROUTES = Symbol("routes");

export type RouteDefinition = {
  method: HttpMethod;
  path: string;
  handlerName: string | symbol;
};

function createMethodDecorator(method: HttpMethod) {
  return (path: string): MethodDecorator =>
    (target: Object, propertyKey: string | symbol) => {
      const ctor = (target as any).constructor;

      const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES, ctor) || [];

      routes.push({
        method,
        path,
        handlerName: propertyKey,
      });

      Reflect.defineMetadata(ROUTES, routes, ctor);
    };
}

export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Patch = createMethodDecorator("PATCH");
export const Delete = createMethodDecorator("DELETE");

export function getRoutes(ctrl: any): RouteDefinition[] {
  return Reflect.getMetadata(ROUTES, ctrl) || [];
}
