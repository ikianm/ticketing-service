import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateProviderDto } from "./dtos/create-provider.dto";
import { ProvidersService } from "./services/provider.service";
import { IsAdminGuard } from "../shares/isAdmin.guard";

@Controller('/providers')
export class ProvidersController {

    constructor(
        private readonly providersService: ProvidersService
    ) { }

    @Post()
    @UseGuards(new IsAdminGuard())
    create(@Body() createProviderDto: CreateProviderDto) {
        return this.providersService.create(createProviderDto);
    }

    @Get()
    findAll() {
        return this.providersService.findAll();
    }
}

