import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GroupsService } from "./services/group.service";
import { CreateGroupDto } from "./dtos/create-group.dto";
import { IsAdminGuard } from "../shares/isAdmin.guard";


@Controller('/groups')
export class GroupsController {

    constructor(
        private readonly groupsService: GroupsService
    ) { }


    @Post()
    @UseGuards(new IsAdminGuard())
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @Get()
    findAll() {
        return this.groupsService.findAll();
    }
}