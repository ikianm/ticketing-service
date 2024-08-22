import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsString, MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateCommentDto {

    @ApiProperty({ example: '66b9c9b8b31f096cc79e1211' })
    @IsMongoId()
    ticketId: ObjectId;

    @ApiProperty({ example: 'this is the content of the comment' })
    @IsString()
    @MinLength(15)
    @MaxLength(400)
    content: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    attachment?: any;
}