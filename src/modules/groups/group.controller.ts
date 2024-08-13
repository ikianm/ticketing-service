import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GroupsService } from "./services/group.service";
import { CreateGroupDto } from "./dtos/create-group.dto";
import { IsAdminGuard } from "../shares/isAdmin.guard";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ResponseGroupDto } from "./dtos/response-group.dto";
import { ResponseFindAllGroups } from "./dtos/response-findAll-group.dto";


@ApiTags('Groups')
@ApiHeader({
    name: 'Authorization',
    description: 'access token'
})
@Controller('/groups')
export class GroupsController {

    constructor(
        private readonly groupsService: GroupsService
    ) { }


    @ApiCreatedResponse({
        description: 'group created successfully',
        type: ResponseGroupDto
    })
    @ApiBadRequestResponse({ description: 'duplicate groupname' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'not a ticketing admin' })
    @Post()
    @UseGuards(IsAdminGuard)
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @ApiCreatedResponse({
        description: 'groups were retrieved',
        isArray: true,
        type: ResponseFindAllGroups
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @Get()
    findAll() {
        return this.groupsService.findAll();
    }
}