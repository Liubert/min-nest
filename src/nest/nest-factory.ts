import { createApp } from "./http/create-app";

export class NestFactory {
    static async create(rootModule: any) {
        return createApp(rootModule);
    }
}
