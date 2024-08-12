import { IsEnum, IsInt, IsMongoId, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { TicketPriorityEnum } from "../enums/ticket-priority.enum";
import { ObjectId } from "mongodb";
import { Transform } from "class-transformer";


export class CreateTicketDto {

    @IsString()
    @MinLength(5)
    @MaxLength(70)
    title: string;

    @IsString()
    @MinLength(15)
    @MaxLength(400)
    issue: string;

    @Transform(({ value }) => parseInt(value))
    @IsEnum(TicketPriorityEnum)
    priority: TicketPriorityEnum;

    @IsMongoId()
    groupId: ObjectId;

    @IsMongoId()
    providerId: ObjectId;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    workspaceId?: number;

}