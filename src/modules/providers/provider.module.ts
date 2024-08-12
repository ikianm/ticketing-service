import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Provider, ProviderSchema } from "./provider.schema";
import { ProvidersController } from "./provider.controller";
import { ProvidersRepository } from "./provider.repository";
import { ProvidersService } from "./services/provider.service";
import { ProvidersApiService } from "./services/providerapi.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }])],
    controllers: [ProvidersController],
    providers: [ProvidersRepository, ProvidersService, ProvidersApiService],
    exports: [ProvidersApiService]
})
export class ProvidersModule { } 