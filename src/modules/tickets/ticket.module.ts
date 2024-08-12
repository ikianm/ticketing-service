import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Ticket, TicketSchema } from "./ticket.schema";
import { TicketsController } from "./ticket.controller";
import { TicketsRepository } from "./ticket.repository";
import { TicketsService } from "./services/ticket.service";
import { GroupsModule } from "../groups/group.module";
import { TicketsValidationsService } from "./services/ticketvalidation.service";
import { ProvidersModule } from "../providers/provider.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
        GroupsModule,
        ProvidersModule
    ],
    controllers: [TicketsController],
    providers: [TicketsRepository, TicketsValidationsService,TicketsService]
})
export class TicketsModule { }