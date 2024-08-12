import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Ticket } from "../tickets/ticket.schema";
import { ObjectId } from "mongodb";


@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Ticket' })
    ticket: ObjectId;

    @Prop({ type: String, required: true })
    content: string;

    @Prop(String)
    attachment: string;

    @Prop({ type: Boolean, default: false })
    isAdminComment: boolean;

    @Prop({ type: Boolean, default: false })
    seenByUser: boolean;

    @Prop({ type: Boolean, default: false })
    seenByAdmin: boolean;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);