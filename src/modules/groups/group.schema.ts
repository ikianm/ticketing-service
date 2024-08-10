import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Group {

    @Prop({ type: String, required: true })
    name: string;

}

export const GroupSchema = SchemaFactory.createForClass(Group);