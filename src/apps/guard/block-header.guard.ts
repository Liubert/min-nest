import { Injectable } from "../../nest/decorators";
import { CanActivate } from "../../nest/http/types";
import { ForbiddenException } from "../../nest/errors/http-exception";

@Injectable()
export class BlockHeaderGuard implements CanActivate {
    async canActivate(ctx: any): Promise<boolean> {
        const blocked = ctx.req.headers["x-block"];

        if (blocked) {
            console.log("[GLOBAL GUARD] Blocked by x-block header");
            throw new ForbiddenException("Request is marked as black list request");
        }

        console.log("[GLOBAL GUARD] Passed");
        return true;
    }
}