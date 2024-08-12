import { Body, Controller, Get, Post } from "@nestjs/common";
import { GroupsService } from "./services/group.service";
import { CreateGroupDto } from "./dtos/create-group.dto";


@Controller('/groups')
export class GroupsController {

    constructor(
        private readonly groupsService: GroupsService
    ) { }

    //protect this route, only admins
    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @Get()
    findAll() {
        return this.groupsService.findAll();
    }
}