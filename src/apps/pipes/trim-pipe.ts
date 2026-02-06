import { Injectable } from "../../nest/decorators";
import { ParamContext, PipeTransform } from "../../nest/http/types";

@Injectable()
export class TrimPipe implements PipeTransform {
  /**
   * Trims string values. If value is an object, recursively trims all string properties.
   */
  transform(value: any, _ctx: ParamContext): any {
    if (typeof value === "string") {
      return value.trim();
    }

    if (value !== null && typeof value === "object") {
      // If it's a body object, trim all its string keys
      Object.keys(value).forEach((key) => {
        value[key] = this.transform(value[key], _ctx);
      });
    }

    return value;
  }
}
