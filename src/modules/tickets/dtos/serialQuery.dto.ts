import { IsNumberString, MaxLength, MinLength } from "class-validator";

export class SerialQuery {

    @IsNumberString()
    @MinLength(8)
    @MaxLength(8)
    serial: string;

}