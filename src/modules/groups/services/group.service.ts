import { BadRequestException, Injectable } from "@nestjs/common";
import { Group } from "../group.schema";
import { GroupsRepository } from "../group.repository";
import { CreateGroupDto } from "../dtos/create-group.dto";
import { ResponseMessageDto } from "src/modules/shares/dtos/response-message.dto";

@Injectable()
export class GroupsService {

    constructor(private readonly groupRepository: GroupsRepository) { }

    async create(createGroupDto: CreateGroupDto): Promise<ResponseMessageDto<Group>> {
        const { name } = createGroupDto;
        const duplicateName = await this.groupRepository.findByName(name);
        if (duplicateName) throw new BadRequestException('گروه با این نام وجود دارد');

        const group = await this.groupRepository.create({ name });

        return { message: 'گروه با موفقیت ساخته شد', data: group };
    }

    async findAll(): Promise<Group[]> {
        return await this.groupRepository.findAll();
    }


}

