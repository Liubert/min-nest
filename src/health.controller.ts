import { Controller, Injectable, Get } from "./nest/decorators";

@Injectable()
@Controller("/health")

export class HealthController {

    @Get("/")
    findAll() {
        return {status: 'success'};
    }



}
