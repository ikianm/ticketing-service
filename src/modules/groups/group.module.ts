import { Module } from "@nestjs/common";
import { GroupsController } from "./group.controller";
import { GroupsService } from "./services/group.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./group.schema";
import { GroupsRepository } from "./group.repository";
import { GroupsApiService } from "./services/groupapi.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
    ],
    controllers: [GroupsController],
    providers: [GroupsService, GroupsApiService, GroupsRepository],
    exports: [GroupsApiService]
})
export class GroupsModule { }