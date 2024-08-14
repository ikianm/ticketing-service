import { ApiProperty } from "@nestjs/swagger";

export class TicketResponse {

    @ApiProperty({ example: 'ticket created successfully' })
    message: string;

    @ApiProperty({
        example: {
            _id: '66b892d965b885a03983e2d0',
            userId: 'ab123456-ab12-ab12-abc123-abcdef12345',
            serial: '12345678',
            group: { _id: '66b892d965b885a03983e2d0', name: 'group a' },
            title: 'title of the ticket',
            issue: 'this is the issue that user is facing',
            priority: 1,
            status: 0,
            provider: { _id: '66b8932d6ce885cfdcf42569', name: 'provider a' },
            attachment: '/path/to/file',
            workspaceId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    date: object;
}