import {Injectable} from "../../nest/decorators";


@Injectable()
export class HttpExceptionFilter {
    async catch(err: any, ctx: any) {
        const statusCode =
            Number(err?.status ?? err?.statusCode) ||
            (err?.name === "BadRequestException" ? 400 : 500);

        const message =
            typeof err?.message === "string"
                ? err.message
                : "Internal Server Error";

        ctx.res.status(statusCode).json({
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: ctx.req.url,
        });
    }
}
