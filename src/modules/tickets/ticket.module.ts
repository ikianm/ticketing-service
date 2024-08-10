import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Ticket, TicketSchema } from "./ticket.schema";


@Module({
    imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])]
})
export class TicketsModule { }