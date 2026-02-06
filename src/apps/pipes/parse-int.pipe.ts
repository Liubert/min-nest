import { Injectable } from "../../nest/decorators";
import { ParamContext, PipeTransform } from "../../nest/http/types";
import { BadRequestException } from "../../nest/errors/http-exception";

@Injectable()
export class ParseIntPipe implements PipeTransform<any, number> {
  transform(value: any, ctx: ParamContext): number {
    const num = Number(value);
    if (Number.isNaN(num)) {
      throw new BadRequestException(`Prop ${ctx.key} with "${value}" must be a number`);
    }
    return num;
  }
}
