import { Module } from "./nest/decorators/module";
import { HealthController } from "./health.controller";
import { UserModule } from "./apps/user/user.module";

@Module({
  imports: [UserModule],
  controllers: [HealthController],
})
export class AppModule {}