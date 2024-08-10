import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateProviderDto } from "./dtos/create-provider.dto";
import { ProvidersService } from "./provider.service";

@Controller('/providers')
export class ProvidersController {

    constructor(
        private readonly providersService: ProvidersService
    ) { }

    @Post()
    create(@Body() createProviderDto: CreateProviderDto) {
        return this.providersService.create(createProviderDto);
    }

    @Get()
    findAll() {
        return this.providersService.findAll();
    }
}

