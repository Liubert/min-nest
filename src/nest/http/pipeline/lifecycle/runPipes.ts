import { Container } from "../../../di-container";
import { RequestData, PipeClass } from "../../types";
import { getParamPipesMeta } from "../../../decorators/param";
import { getUsePipes, getParamUsePipes } from "../../../decorators/use-pipe.decorator";

type PipeInstance = {
  transform: (value: any, ctx: RequestData) => any | Promise<any>;
};

type PipeType = PipeClass | PipeInstance;

function resolvePipe(pipe: PipeType): PipeInstance {
  if (typeof pipe === "function") {
    return Container.resolve(pipe as any) as any;
  }
  return pipe;
}

async function applyPipes(
    pipes: PipeType[],
    value: any,
    ctx: RequestData,
) {
  for (const pipe of pipes) {
    value = await resolvePipe(pipe).transform(value, ctx);
  }
  return value;
}

/**
 * Runs pipes for single param value in strict order:
 *
 * Global
 * → Controller
 * → Method
 * → Param (@UsePipe on param)
 * → Param (@Param/@Query/@Body pipes)
 */
export async function runPipesForParam(
    controllerCtor: Function,
    methodName: string | symbol,
    paramIndex: number,
    ctx: RequestData,
    initialValue: any,
    globalPipes: PipeType[] = [],
) {
  // ---- PARAM METADATA (@Param, @Query, @Body) ----
  const paramMetaAll =
      getParamPipesMeta(controllerCtor.prototype, methodName) || {};
  const paramMeta = paramMetaAll[paramIndex] || [];

  // ---- @UsePipe metadata ----
  const controllerPipes = (getUsePipes(controllerCtor) ?? []) as PipeType[];

  const methodPipes = (getUsePipes(
      controllerCtor.prototype,
      methodName,
  ) ?? []) as PipeType[];

  const paramUsePipes = (getParamUsePipes(
      controllerCtor.prototype,
      methodName,
      paramIndex,
  ) ?? []) as PipeType[];

  // key comes from first param decorator if exists
  ctx.key = paramMeta?.[0]?.key ?? "";

  let value = initialValue;

  // 1) Global pipes
  value = await applyPipes(globalPipes, value, ctx);

  // 2) Controller-level pipes
  value = await applyPipes(controllerPipes, value, ctx);
  //
  // // 3) Method-level pipes
  value = await applyPipes(methodPipes, value, ctx);

  // 4) Param-level @UsePipe
  value = await applyPipes(paramUsePipes, value, ctx);

  // 5) Param decorators pipes
  for (const meta of paramMeta) {
    if (!meta.pipe) continue;
    ctx.key = meta.key ?? ctx.key;

    // meta.pipe may be class or instance -> PipeType
    value = await applyPipes([meta.pipe as PipeType], value, ctx);
  }

  return value;
}
