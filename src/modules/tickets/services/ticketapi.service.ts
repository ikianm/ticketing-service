import { Injectable } from "@nestjs/common";
import { TicketsRepository } from "../ticket.repository";
import { ObjectId } from "mongodb";
import { Ticket } from "../ticket.schema";


@Injectable()
export class TicketsApiService {

    constructor(private readonly ticketsRepository: TicketsRepository) { }

    async findById(id: ObjectId): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findById(id);
        
        return ticket;
    }
}