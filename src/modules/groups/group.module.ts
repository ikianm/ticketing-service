import { Module } from "@nestjs/common";
import { GroupsController } from "./group.controller";
import { GroupsService } from "./group.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./group.schema";
import { GroupsRepository } from "./group.repository";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
    ],
    controllers: [GroupsController],
    providers: [GroupsService, GroupsRepository]
})
export class GroupsModule { }