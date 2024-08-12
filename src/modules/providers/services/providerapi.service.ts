import { Injectable } from "@nestjs/common";
import { ProvidersRepository } from "../provider.repository";
import { ObjectId } from "mongodb";
import { Provider } from "../provider.schema";


@Injectable()
export class ProvidersApiService {

    constructor(private readonly providersRepository: ProvidersRepository) { }

    async findById(id: ObjectId): Promise<Provider> {
        return await this.providersRepository.findById(id);
    }
}