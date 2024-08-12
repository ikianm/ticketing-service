import { InjectModel } from "@nestjs/mongoose";
import { IBaseRepository } from "../shares/base-repository.interface";
import { Provider } from "./provider.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ProvidersRepository implements IBaseRepository<Provider> {

    constructor(
        @InjectModel(Provider.name)
        private readonly providerModel: Model<Provider>
    ) { }

    async create(data: Partial<Provider>): Promise<Provider> {
        const provider = new this.providerModel(data);
        return await provider.save();
    }

    async findAll(): Promise<Provider[]> {
        return await this.providerModel.find();
    }

    async findByName(name: string): Promise<Provider> {
        return await this.providerModel.findOne({ name });
    }

    async findById(id: ObjectId): Promise<Provider> {
        return await this.providerModel.findById(id);
    }
}