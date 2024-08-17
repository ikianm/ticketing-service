import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateProviderDto } from "./dtos/create-provider.dto";
import { ProvidersService } from "./services/provider.service";
import { IsAdminGuard } from "../shares/isAdmin.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ResponseProvderDto } from "./dtos/response-provider.dto";
import { ResponseFindAllProviders } from "./dtos/response-findAll-providers.dto";

@ApiTags('Providers')
@ApiBearerAuth('access-token')
@Controller('/providers')
export class ProvidersController {

    constructor(
        private readonly providersService: ProvidersService
    ) { }

    @ApiCreatedResponse({
        description: 'provider created successfully',
        type: ResponseProvderDto,
        isArray: true
    })
    @ApiBadRequestResponse({ description: 'duplicate providername' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'not a ticketing admin' })
    @Post()
    @UseGuards(IsAdminGuard)
    create(@Body() createProviderDto: CreateProviderDto) {
        return this.providersService.create(createProviderDto);
    }

    @ApiCreatedResponse({
        description: 'groups were retrieved',
        isArray: true,
        type: ResponseFindAllProviders
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @Get()
    findAll() {
        return this.providersService.findAll();
    }
}

