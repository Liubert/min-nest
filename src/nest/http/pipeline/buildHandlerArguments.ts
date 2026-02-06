import { RequestData, RouteLifecycleContext } from "../types";
import { getParamPipesMeta } from "../../decorators";
import { runPipesForParam } from "./lifecycle/runPipes";

/**
 * Builds handler args: extracts raw values from req and runs pipes.
 */
export async function buildHandlerArgsWithPipes(
    ctx: RouteLifecycleContext,
): Promise<any[]> {
    console.log("[NEST-LIFECYCLE] Phase: Argument Extraction & Pipe Transformation");

    const handlerName = ctx.handlerName;
    const paramCount = ctx.controllerInstance[handlerName].length;

    const reqData: RequestData = {
        query: ctx.req.query || {},
        params: ctx.req.params || {},
        body: ctx.req.body,
    };

    const paramMetaByIndex =
        getParamPipesMeta(ctx.controllerCtor.prototype, handlerName) || {};

    const args = new Array(paramCount).fill(undefined);

    for (let i = 0; i < paramCount; i++) {
        args[i] = await resolveArgValueWithPipes(ctx, i, paramMetaByIndex[i], reqData);
    }

    return args;
}

async function resolveArgValueWithPipes(
    ctx: RouteLifecycleContext,
    index: number,
    metaForParam: any[],
    reqData: RequestData,
): Promise<any> {
    if (!metaForParam || metaForParam.length === 0) return undefined;

    const firstDecorator = metaForParam[0];

    const rawValue = extractFromRequest(reqData, firstDecorator.source, firstDecorator.key);

    console.log(
        `  -> Param[${index}] Extracted from {${firstDecorator.source}} key: "${firstDecorator.key || "*"}"`,
    );

    console.log(`  -> Param[${index}] Running Pipe Pipeline...`);

    return runPipesForParam(
        ctx.controllerCtor,
        ctx.handlerName,
        index,
        { ...reqData, key: firstDecorator.key },
        rawValue,
        ctx.globalPipes ?? [],
    );
}

function extractFromRequest(
    reqData: RequestData,
    from: "params" | "query" | "body",
    key?: string,
) {
    const data =
        from === "body" ? reqData.body : from === "query" ? reqData.query : reqData.params;

    return key ? (data as any)?.[key] : data;
}
