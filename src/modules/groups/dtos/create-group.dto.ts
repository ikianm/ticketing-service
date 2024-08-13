import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";


export class CreateGroupDto {
    
    @ApiProperty({example: 'group one'})
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    name: string;
    
}