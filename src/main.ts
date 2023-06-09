import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    // get port from config service
    const configService = app.get(ConfigService);
    const port = configService.get("PORT");
    await app.listen(port || 8888);
}
bootstrap();
