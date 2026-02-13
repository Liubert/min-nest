import { ZodError, ZodSchema } from "zod";
import { PipeTransform, ParamContext } from "../../nest/http/types";
import { BadRequestException } from "../../nest/errors/http-exception";

export class ZodParamPipe<TOut = unknown> implements PipeTransform<unknown, TOut> {
    constructor(private readonly schema: ZodSchema<TOut>) {}

    transform(value: unknown, ctx: ParamContext): TOut {
        try {
            return this.schema.parse(value);
        } catch (e) {
            if (e instanceof ZodError) {
                const details = e.issues
                    .map((i) => `${ctx.key ?? "value"}: ${i.message}`)
                    .join("; ");
                throw new BadRequestException(`Validation failed: ${details || "Invalid value"}`);
            }
            throw new BadRequestException("Validation failed");
        }
    }
}
