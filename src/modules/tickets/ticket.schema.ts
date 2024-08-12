import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { TicketPriorityEnum } from "./enums/ticket-priority.enum";
import { TicketStatusEnum } from "./enums/ticket-status.enum";
import { ObjectId } from "mongodb";


@Schema({ timestamps: true })
export class Ticket {

    _id?: ObjectId;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true, unique: true })
    serial: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Group' })
    group: ObjectId;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    issue: string;

    @Prop({ type: Number, enum: TicketPriorityEnum, default: TicketPriorityEnum.LOW })
    priority: TicketPriorityEnum;

    @Prop({ type: Number, enum: TicketStatusEnum, default: TicketStatusEnum.NEW })
    status: TicketStatusEnum;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Provider' })
    provider: ObjectId;

    @Prop(String)
    attachment: string;

    @Prop(Number)
    workspaceId: number;

}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
