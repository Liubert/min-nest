import "reflect-metadata";

export type Class<T = any> = new (...args: any[]) => T;
export type Token<T = any> = Class<T> | string | symbol;

export type Provider<T = any> = {
  useClass: Class<T>;
};

export const INJECT_METADATA_KEY = "custom:inject_tokens";
export const INJECTABLE_METADATA_KEY = "custom:injectable";

type PipeInstance = {
  transform: (value: any, ctx: any) => any | Promise<any>;
};

const isClass = (v: unknown): v is Class => typeof v === "function";

const isInjectable = (cls: Class): boolean =>
    Boolean(Reflect.getMetadata(INJECTABLE_METADATA_KEY, cls));

export class Container {
  private static providers = new Map<Token, Provider>();
  private static instances = new Map<Token, any>();

  static register<T>(token: Token<T>, provider: Provider<T>) {
    if (this.providers.has(token)) {
      throw new Error(`Provider already registered for token: ${String(token)}`);
    }
    this.providers.set(token, provider);
  }

  static resolve<T>(token: Token<T>): T {
    const cached = this.instances.get(token);
    if (cached) return cached;

    const provider = this.providers.get(token);

    // 1) Registered provider (token can be class|string|symbol)
    if (provider) {
      return this.instantiate(token, provider.useClass);
    }

    // 2) Unregistered tokens:
    // Only classes can be auto-instantiated, and only if @Injectable
    if (!isClass(token)) {
      throw new Error(`No provider found for token: ${String(token)}`);
    }

    if (!isInjectable(token)) {
      throw new Error(
          `Class ${token.name} is not @Injectable and has no provider registered`,
      );
    }

    return this.instantiate(token, token);
  }

  private static instantiate<T>(cacheToken: Token<T>, target: Class<T>): T {
    const paramTypes: unknown[] =
        Reflect.getMetadata("design:paramtypes", target) ?? [];

    const customTokens: Record<number, Token> =
        Reflect.getMetadata(INJECT_METADATA_KEY, target) ?? {};

    const deps = paramTypes.map((paramType, index) => {
      const depToken = customTokens[index] ?? (paramType as Token);

      // Interfaces become Object at runtime
      if (depToken === Object) {
        throw new Error(
            `Cannot resolve dependency at index ${index} for ${target.name}. ` +
            `Got "Object" (likely interface). Use @Inject(TOKEN).`,
        );
      }

      return this.resolve(depToken);
    });

    const instance = new target(...deps);
    this.instances.set(cacheToken, instance);
    return instance;
  }
}
