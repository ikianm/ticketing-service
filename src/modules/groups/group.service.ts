import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Group } from "./group.schema";
import { GroupsRepository } from "./group.repository";
import { CreateGroupDto } from "./dtos/create-group.dto";
import { ResponseCreateDto } from "../shares/response-create.dto";

@Injectable()
export class GroupsService {

    constructor(private readonly groupRepository: GroupsRepository) { }

    async create(createGroupDto: CreateGroupDto): Promise<ResponseCreateDto<Group>> {
        const { name } = createGroupDto;
        const duplicateName = await this.groupRepository.findByName(name);
        console.log(duplicateName);
        if (duplicateName) throw new BadRequestException('گروه با این نام وجود دارد');

        const group = await this.groupRepository.create({ name });

        return { message: 'گروه با موفقیت ساخته شد', data: group };
    }

    async findAll(): Promise<Group[]> {
        return await this.groupRepository.findAll();
    }


}

