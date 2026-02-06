import { NestInterceptor } from "../../nest/http/types";
import { Injectable } from "../../nest/decorators";

@Injectable()
export class RequestTimeInterceptor implements NestInterceptor {
  before(ctx: any) {
    console.log("-- RequestTimeInterceptor before");
    ctx.__startTime = Date.now();
  }

  after(result: any, ctx: any) {
    const now = Date.now();
    const start = ctx.__startTime ?? now;
    const duration = now - start;
    console.log("-- RequestTimeInterceptor after");
    return {
      ...result,
      startRequest: start,
      endRequest: now,
      durationMs: duration,
    };
  }
}
