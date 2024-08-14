import { ApiProperty } from "@nestjs/swagger";


export class CommentResponse {

    @ApiProperty({ example: 'comment created successfully' })
    message: string;

    @ApiProperty({
        example: {
            _id: '66b892d965b885a03983e2d0',
            userId: 'ab123456-ab12-ab12-abc123-abcdef12345',
            content: 'this is the content of the comment',
            attachment: '/path/to/file',
            isAdminComment: false,
            seenByAdmin: false,
            seenByUser: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    date: object;


}
