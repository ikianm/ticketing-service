import { ApiProperty } from "@nestjs/swagger";
import { TicketPriorityEnum } from "../enums/ticket-priority.enum";
import { TicketStatusEnum } from "../enums/ticket-status.enum";
import { Group } from "src/modules/groups/group.schema";
import { Provider } from "@nestjs/common";


export class FindTicketResponses {

    @ApiProperty({ example: '66b9abc73e9abf8111d882be' })
    _id: string;

    @ApiProperty({ example: 'ab123456-ab12-ab12-abc123-abcdef12345' })
    userId: string;

    @ApiProperty({ example: '13579246' })
    serial: string;

    @ApiProperty({ description: 'name and _id of related group' })
    group: Group;

    @ApiProperty({ example: 'title of the ticket' })
    title: string;

    @ApiProperty({ example: 'this is a summary of the issuing the user is facing' })
    issue: string;

    @ApiProperty({
        example: 0,
        enum: TicketPriorityEnum,
        description: '0=low, 1=intermeddiate, 2=high'
    })
    priority: TicketPriorityEnum;

    @ApiProperty({
        example: 0,
        enum: TicketStatusEnum,
        description: '0=new, 1=open, 2=closed'
    })
    status: TicketStatusEnum;

    @ApiProperty({ description: 'name and _id of related rovidder' })
    provider: Provider;

    @ApiProperty({ example: '/path/to/attchment', examples: ['', '/path/to/attchment'] })
    attachment: string;

    @ApiProperty({ example: 2 })
    workspaceId: number;
}