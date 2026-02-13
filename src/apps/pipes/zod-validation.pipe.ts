import { ZodError, ZodSchema } from "zod";
import { PipeTransform, ParamContext } from "../../nest/http/types";
import { BadRequestException } from "../../nest/errors/http-exception";

export class ZodValidationPipe<TOut = unknown> implements PipeTransform<unknown, TOut> {
    constructor(private readonly schema: ZodSchema<TOut>) {}

    transform(value: unknown, ctx: ParamContext): TOut {
        try {
            return this.schema.parse(value);
        } catch (e) {
            if (e instanceof ZodError) {
                const details = e.issues
                    .map((i) => {
                        const path = i.path?.length ? i.path.join(".") : (ctx.key || "value");
                        return `${path}: ${i.message}`;
                    })
                    .join("; ");

                throw new BadRequestException(
                    details ? `Validation failed: ${details}` : "Validation failed"
                );
            }

            throw new BadRequestException("Validation failed");
        }
    }
}
