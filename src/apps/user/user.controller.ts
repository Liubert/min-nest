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
  UsePipe,
} from "../../nest/decorators";

@Injectable()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/:id")
  update(
      @UsePipe(ParseIntPipe) @Param("id") id: number,
      @UsePipe(TrimPipe, StringNotEmptyPipe) @Query("name") name: string,
      @Body() body: any,
  ) {
    return { id, name, body };
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

  @UseGuards(AuthGuard)
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
