import { BadRequestException, Injectable } from "@nestjs/common";
import { Provider } from "../provider.schema";
import { CreateProviderDto } from "../dtos/create-provider.dto";
import { ResponseMessageDto } from "src/modules/shares/dtos/response-message.dto";
import { ProvidersRepository } from "../provider.repository";


@Injectable()
export class ProvidersService {

    constructor(private readonly providersRepository: ProvidersRepository) { }

    async create(createProviderDto: CreateProviderDto): Promise<ResponseMessageDto<Provider>> {
        const { name } = createProviderDto;
        const duplicateProvider = await this.providersRepository.findByName(name);
        if (duplicateProvider) throw new BadRequestException('پرووایدر با این نام وجود دارد');

        const provider = await this.providersRepository.create({ name });

        return { message: 'پرووایدر با موفقیت ساخته شد', data: provider };
    }

    async findAll(): Promise<Provider[]> {
        return await this.providersRepository.findAll();
    }
}