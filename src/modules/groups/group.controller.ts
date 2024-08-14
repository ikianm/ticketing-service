import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GroupsService } from "./services/group.service";
import { CreateGroupDto } from "./dtos/create-group.dto";
import { IsAdminGuard } from "../shares/isAdmin.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { GroupResponse } from "./swaggerResponses/group-response";
import { FindGroupResponse } from "./swaggerResponses/find-group-response";


@ApiTags('Groups')
@ApiBearerAuth('access-token')
@Controller('/groups')
export class GroupsController {

    constructor(
        private readonly groupsService: GroupsService
    ) { }


    @ApiCreatedResponse({
        description: 'group created successfully',
        type: GroupResponse
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
        type: FindGroupResponse
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @Get()
    findAll() {
        return this.groupsService.findAll();
    }
}