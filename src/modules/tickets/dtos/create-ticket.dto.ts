import { IsEnum, IsInt, IsMongoId, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { TicketPriorityEnum } from "../enums/ticket-priority.enum";
import { ObjectId } from "mongodb";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateTicketDto {

    @ApiProperty({ example: 'title of the ticket' })
    @IsString()
    @MinLength(5)
    @MaxLength(70)
    title: string;

    @ApiProperty({ example: 'this is a summary of the issuing the user is facing' })
    @IsString()
    @MinLength(15)
    @MaxLength(400)
    issue: string;

    @ApiProperty({
        example: 0,
        enum: TicketPriorityEnum,
        description: '0=low, 1=intermeddiate, 2=high'
    })
    @Transform(({ value }) => parseInt(value))
    @IsEnum(TicketPriorityEnum)
    priority: TicketPriorityEnum;

    @ApiProperty({
        example: '66b892d965b885a03983e2d0',
        description: 'id of the related group'
    })
    @IsString()
    groupId: string;

    @ApiProperty({
        example: '66b892d965b885a03983e2d0',
        description: 'id of the related provider'
    })
    @IsString()
    providerId: string;

    @ApiPropertyOptional(
        {
            example: 1,
            description: 'id of the related provider',
            type: 'number'
        }
    )
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    workspaceId?: number;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    attachment: any;

}