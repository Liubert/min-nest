export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BuiltRoute = {
  method: HttpMethod;
  fullPath: string;
  controllerCtor: any;
  controllerInstance: any;
  handlerName: string | symbol;
};

export type RouteLifecycleContext = {
  req: any;
  res: any;
  next: (err?: any) => void;
  controllerInstance: any;
  controllerCtor: any;
  handlerName: string | symbol;

  globalPipes?: PipeClass[];
  globalGuards?: any[];
};

export type RequestData = {
  key?: string;
  query: Record<string, any>;
  params: Record<string, any>;
  body: any;
};

export type ParamContext = RequestData & {
  req: any;
  controller: Function;
  handlerName: string | symbol;
  paramIndex: number;
  key: string;
};

export interface PipeTransform<T = any, R = any> {
  transform(value: T, ctx: ParamContext): R | Promise<R>;
}

export type PipeClass = new (...args: any[]) => PipeTransform;

export interface NestInterceptor {
  before?(ctx: any): void | Promise<void>;
  after?(result: any, ctx: any): any | Promise<any>;
}

export interface CanActivate {
  canActivate(ctx: any): boolean | Promise<boolean>;
}
