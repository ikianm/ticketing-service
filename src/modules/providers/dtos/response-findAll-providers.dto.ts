import { ApiProperty } from "@nestjs/swagger";


export class ResponseFindAllProviders {
    @ApiProperty({ example: '66b892d965b885a03983e2d0' })
    _id: string;

    @ApiProperty({ example: 'provider one' })
    name: string;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    @ApiProperty({ example: new Date() })
    updatedAt: Date;
}