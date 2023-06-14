import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // cors
    app.enableCors({
        origin: "*"
    });
    // get port from config service
    const configService = app.get(ConfigService);
    const port = configService.get("PORT") || 8888;
    await app.listen(port);
}
bootstrap();
