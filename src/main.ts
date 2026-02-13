import { AppModule } from "./app.module";
import { TrimPipe } from "./apps/pipes/trim-pipe";
import { BlockHeaderGuard } from "./apps/guard/block-header.guard";
import { NestFactory } from "./nest/nest-factory";
import { RequestTimeInterceptor } from "./apps/interceptors/request-time.interceptor";
import {HttpExceptionFilter} from "./apps/filters/http-exception.filter";

async function main() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes([TrimPipe]);
  app.useGlobalGuards([BlockHeaderGuard])
  // app.useGlobalInterceptors([RequestTimeInterceptor]);
  app.useGlobalFilters([HttpExceptionFilter]);

  app.listen(8080, () => {
    console.log("Running on 8080");
  });
}

main();
