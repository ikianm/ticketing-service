import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {

    @ApiProperty({ example: '66b9c9b8b31f096cc79e1211' })
    ticketId: string;

    @ApiProperty({ example: 'this is the content of the comment' })
    @IsString()
    @MinLength(15)
    @MaxLength(400)
    content: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    attachment?: any;
}