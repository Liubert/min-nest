import { AppModule } from "./app.module";
import { createApp } from "./nest/http/create-app";
import { TrimPipe } from "./apps/pipes/trim-pipe";
import { BlockHeaderGuard } from "./apps/guard/block-header.guard";

async function main() {
  const app = await createApp(AppModule);
  app.useGlobalPipes([TrimPipe]);
  app.useGlobalGuards([BlockHeaderGuard])
  app.listen(8080, () => {
    console.log("Running on 8080");
  });
}

main();
