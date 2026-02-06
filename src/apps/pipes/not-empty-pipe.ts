import { Injectable } from "../../nest/decorators";
import { ParamContext, PipeTransform } from "../../nest/http/types";
import { BadRequestException } from "../../nest/errors/http-exception";

@Injectable()
export class StringNotEmptyPipe implements PipeTransform<string, string> {
  transform(value: any, ctx: ParamContext): string {
    if (value === undefined || value === null || value === "") {
      throw new BadRequestException(`Prop ${ctx.key} must not be empty`);
    }
    return value;
  }
}
