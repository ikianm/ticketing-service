import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Provider, ProviderSchema } from "./provider.schema";
import { ProvidersController } from "./provider.controller";
import { ProvidersRepository } from "./provider.repository";
import { ProvidersService } from "./provider.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }])],
    controllers: [ProvidersController],
    providers: [ProvidersRepository, ProvidersService]
})
export class ProvidersModule { } 