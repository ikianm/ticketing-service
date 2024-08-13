import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";


export class CreateProviderDto {

    @ApiProperty({ example: 'provider one' })
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    name: string;

}