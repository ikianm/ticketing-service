import { IsMongoId, IsString, MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongodb";


export class CreateCommentDto {

    @IsMongoId()
    ticketId: ObjectId;

    @IsString()
    @MinLength(15)
    @MaxLength(400)
    content: string;

    
}