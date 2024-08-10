import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: true})
export class Provider {

    @Prop({type: String, required: true})
    name: string;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);