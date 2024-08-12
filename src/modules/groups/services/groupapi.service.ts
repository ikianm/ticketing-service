import { Injectable } from "@nestjs/common";
import { GroupsRepository } from "../group.repository";
import { Group } from "../group.schema";
import { ObjectId } from "mongodb";


@Injectable()
export class GroupsApiService {

    constructor(private readonly groupsRepository: GroupsRepository) { }

    async findByName(name: string): Promise<Group> {
        return await this.groupsRepository.findByName(name);
    }

    async findById(id: ObjectId): Promise<Group> {
        return await this.groupsRepository.findById(id);
    }
}