import { Injectable } from "../../nest/decorators";
import { CanActivate } from "../../nest/http/types";


@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: any): Promise<boolean> {
    const req = ctx.req;
    const authHeader = req.headers["authorization"];
    console.log("-- AuthGuard: header =", authHeader);
    return Boolean(authHeader);
  }
}
