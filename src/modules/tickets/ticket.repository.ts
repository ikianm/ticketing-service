import { Injectable } from "@nestjs/common";
import { IBaseRepository } from "../shares/base-repository.interface";
import { Ticket } from "./ticket.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TicketStatusEnum } from "./enums/ticket-status.enum";
import { ObjectId } from "mongodb";


@Injectable()
export class TicketsRepository implements IBaseRepository<Ticket> {

    constructor(
        @InjectModel(Ticket.name)
        private readonly ticketModel: Model<Ticket>
    ) { }

    async create(data: Partial<Ticket>): Promise<Ticket> {
        const ticket = await this.ticketModel.create(data);
        return await ticket.save();
    }

    async findAll(
        { skip, limit }: { skip: number, limit: number }
    ): Promise<Ticket[]> {
        const tickets = await this.ticketModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate('group', 'name')
            .populate('provider', 'name')
            .exec();

        return tickets;
    }

    async findAllNewTicketsAsGroup(
        { groupName, skip, limit }: { groupName: string, skip: number, limit: number }
    ): Promise<Ticket[]> {

        return await this.ticketModel
            .find()
            .populate('group', 'name')
            .where('group.name').equals(groupName)
            .where('status').equals(TicketStatusEnum.NEW)
            .populate('provider', 'name')
            .skip(skip)
            .limit(limit)
            .exec();

    }

    async findById(id: ObjectId): Promise<Ticket> {
        return await this.ticketModel.findById(id);
    }

    async findBySerial(serial: string): Promise<Ticket> {
        return await this.ticketModel
            .findOne()
            .where('serial').equals(serial)
            .exec();
    }

    async populatedFindById(id: ObjectId): Promise<Ticket> {
        return await this.ticketModel
            .findById(id)
            .populate('group', 'name')
            .populate('provider', 'name')
            .exec();
    }


}