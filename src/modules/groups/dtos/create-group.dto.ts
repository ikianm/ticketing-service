import { IsString, MaxLength, MinLength } from "class-validator";


export class CreateGroupDto {
    
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    name: string;
    
}