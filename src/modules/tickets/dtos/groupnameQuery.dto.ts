import { IsString } from "class-validator";


export class GroupNameQueryDto {

    @IsString()
    groupName: string;

}