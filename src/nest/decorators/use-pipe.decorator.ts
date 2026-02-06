import "reflect-metadata";
import { PipeClass } from "../http/types";

// Controller + Method: PipeType[]
const USE_PIPES_KEY = "mini:use_pipes";

// Param-level: Record<number, PipeType[]>
const PARAM_USE_PIPES_KEY = "mini:param_use_pipes";

type PipeInstance = {
    transform: (value: any, ctx: any) => any | Promise<any>;
};

export type PipeType = PipeClass | PipeInstance;

export function UsePipe(...pipes: PipeType[]) {
    return (
        target: any,
        propertyKey?: string | symbol,
        parameterIndex?: number,
    ) => {
        // PARAMETER decorator
        if (typeof parameterIndex === "number") {
            const all: Record<number, PipeType[]> =
                Reflect.getMetadata(PARAM_USE_PIPES_KEY, target, propertyKey!) ?? {};

            all[parameterIndex] = [...(all[parameterIndex] ?? []), ...pipes];

            Reflect.defineMetadata(PARAM_USE_PIPES_KEY, all, target, propertyKey!);
            return;
        }

        // METHOD decorator
        if (propertyKey) {
            const existing = Reflect.getMetadata(USE_PIPES_KEY, target, propertyKey);
            const list = Array.isArray(existing) ? existing : [];

            Reflect.defineMetadata(USE_PIPES_KEY, [...list, ...pipes], target, propertyKey);
            return;
        }

        // CONTROLLER decorator
        const existing = Reflect.getMetadata(USE_PIPES_KEY, target);
        const list = Array.isArray(existing) ? existing : [];

        Reflect.defineMetadata(USE_PIPES_KEY, [...list, ...pipes], target);
    };
}

export function getUsePipes(
    target: any,
    propertyKey?: string | symbol,
): PipeType[] {
    // @ts-ignore
    const v = Reflect.getMetadata(USE_PIPES_KEY, target, propertyKey);
    return Array.isArray(v) ? v : [];
}

export function getParamUsePipes(
    target: any,
    propertyKey: string | symbol,
    index: number,
): PipeType[] {
    const all = Reflect.getMetadata(PARAM_USE_PIPES_KEY, target, propertyKey) ?? {};
    const v = all?.[index];
    return Array.isArray(v) ? v : [];
}
