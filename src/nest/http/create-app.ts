import express from "express";
import { buildRoutes } from "./routes/buildRoutes";
import { registerRoutes } from "./routes/registerRoutes";
import { bootstrapModule } from "../module/bootstrap";
import type { Express } from "express";

export type Type<T = any> = new (...args: any[]) => T;

export interface GlobalConfigApi {
  useGlobalPipes(pipes: Type[]): void;
  useGlobalGuards(guards: Type[]): void;
  useGlobalInterceptors(interceptors: Type[]): void;
  useGlobalFilters(filters: Type[]): void;
}

export type NestLikeApp = Express & GlobalConfigApi;

export async function createApp(
    ModuleClass: any,
) {
  console.log("[APP] createApp: start");

  const app = express();
  app.use(express.json());

  // Bootstrap DI + module graph
  const { controllers } = await bootstrapModule(ModuleClass);

  // Routes
  const builtRoutes = buildRoutes(controllers);

  const {
    useGlobalPipes,
    useGlobalGuards,
    useGlobalInterceptors,
    useGlobalFilters,
  } = registerRoutes(app, builtRoutes);

  const nestApp: NestLikeApp = Object.assign(app, {
    useGlobalPipes,
    useGlobalGuards,
    useGlobalInterceptors,
    useGlobalFilters,
  });

  return nestApp;
}
