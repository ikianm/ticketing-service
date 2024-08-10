import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Group } from "src/modules/groups/group.schema";
import { TicketPriority } from "./enums/ticket-priority.enum";
import { TicketStatus } from "./enums/ticket-status.enum";
import { Provider } from "src/modules/providers/provider.schema";


@Schema({ timestamps: true })
export class Ticket {

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true, unique: true })
    serial: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Group' })
    group: Group;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    issue: string;

    @Prop({ type: String, enum: TicketPriority, default: TicketPriority.LOW })
    priority: TicketPriority;

    @Prop({ type: String, enum: TicketStatus, default: TicketStatus.NEW })
    status: TicketStatus;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Provider' })
    provider: Provider;

    @Prop(String)
    attachment: string;

    @Prop(Number)
    workspaceId: number;

}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
