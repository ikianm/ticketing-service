import { ApiProperty } from "@nestjs/swagger";


export class GroupResponse {

    @ApiProperty({ example: 'گروه با موفقیت ساخته شد' })
    message: string;

    @ApiProperty({
        example: {
            _id: '66b892d965b885a03983e2d0',
            name: 'group one',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    data: Object;

}