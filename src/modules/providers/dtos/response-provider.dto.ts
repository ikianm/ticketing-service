import { ApiProperty } from "@nestjs/swagger";


export class ResponseProvderDto {

    @ApiProperty({ example: 'پرووایدر با موفقیت ساخته شد' })
    message: string;

    @ApiProperty({
        example: {
            _id: '66b892d965b885a03983e2d0',
            name: 'provider one',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    data: Object;
}