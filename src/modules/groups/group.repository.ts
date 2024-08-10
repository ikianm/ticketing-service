import { InjectModel } from "@nestjs/mongoose";
import { IBaseRepository } from "../shares/base-repository.interface";
import { Group } from "./group.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GroupsRepository implements IBaseRepository<Group> {

    constructor(
        @InjectModel(Group.name)
        private readonly groupModel: Model<Group>
    ) { }

    async create(data: Partial<Group>): Promise<Group> {
        const group = new this.groupModel({ name: data.name });
        return await group.save();
    }

    async findAll(): Promise<Group[]> {
        return await this.groupModel.find();
    }

    async findByName(name: string): Promise<Group> {
        return await this.groupModel.findOne({ name });
    }


}