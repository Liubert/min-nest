import { ParseIntPipe } from "../pipes/parse-int.pipe";
import { StringNotEmptyPipe } from "../pipes/not-empty-pipe";
import { TrimPipe } from "../pipes/trim-pipe";
import { AuthGuard } from "../guard/auth.guard";
import { UserService } from "./user.service";

import {
  Body,
  Injectable,
  Param,
  Query,
  UseGuards,
  Get,
  Post,
  Controller,
  UsePipe, UseInterceptor,
} from "../../nest/decorators";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import {RequestTimeInterceptor} from "../interceptors/request-time.interceptor";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const querySchema = z.object({
  name: z.string().min(3).transform((s) => s.trim()),
  age: z.coerce.number().int().min(0),
});

@Injectable()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/:id")
  update(
      @UsePipe(new ZodValidationPipe(paramsSchema)) @Param() { id }: { id: number },
      @UsePipe(new ZodValidationPipe(querySchema)) @Query() { name, age }: { name: string; age: number },
      @Body() body: any,
  ) {
    return { id, name, age, body };
  }

  @Get("/")
  findAll(
      @UsePipe(StringNotEmptyPipe) @Query("name") name: string,
      @UsePipe(ParseIntPipe) @Query("id") id: number,
      @UsePipe(ParseIntPipe) @Query("age") age: number,
  ) {
    return this.userService.createUser({
      id,
      age,
      name,
      status: name,
    });
  }

  @UseGuards(AuthGuard)
  @Post("/status/:status")
  create(
      @UsePipe(TrimPipe) @Body() body: any,
      @UsePipe(TrimPipe, StringNotEmptyPipe) @Param("status") status: string,
      @UsePipe(TrimPipe, StringNotEmptyPipe) @Query("name") name: string,
      @UsePipe(ParseIntPipe) @Query("id") id: number,
      @UsePipe(ParseIntPipe) @Query("age") age: number,
  ) {
    return this.userService.createUser({
      id,
      age,
      name,
      status,
      body,
    });
  }

  // @UseGuards(AuthGuard)
  @UseInterceptor(RequestTimeInterceptor)
  @Get("/me")
  getMe(
      // @UsePipe(TrimPipe, StringNotEmptyPipe) @Param("name") name: string,
      // @UsePipe(ParseIntPipe) @Param("id") id: number,
      // @UsePipe(ParseIntPipe) @Param("age") age: number,
  ) {
    return {
      id:'myID',
      age: 'myAge',
      name: 'myName',
    };
  }
}
