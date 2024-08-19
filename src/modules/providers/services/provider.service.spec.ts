import { Test, TestingModule } from "@nestjs/testing";
import { ProvidersRepository } from "../provider.repository";
import { ProvidersService } from "./provider.service";
import { Provider } from "../provider.schema";
import { BadRequestException } from "@nestjs/common";


describe('providersService', () => {
    let service: ProvidersService;
    let repository: ProvidersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProvidersService,
                {
                    provide: ProvidersRepository,
                    useValue: {
                        findAll: jest.fn(),
                        findByName: jest.fn(),
                        create: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<ProvidersService>(ProvidersService);
        repository = module.get<ProvidersRepository>(ProvidersRepository);

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('FindAll Providers', () => {

        const providers = [
            {
                _id: '123',
                name: 'provider one',
                createdAt: '2024/Aug/19',
                updatedAt: '2024/Aug/19'
            },
            {
                _id: '456',
                name: 'provider two',
                createdAt: '2024/Aug/19',
                updatedAt: '2024/Aug/19'
            },
            {
                _id: '789',
                name: 'provider three',
                createdAt: '2024/Aug/19',
                updatedAt: '2024/Aug/19'
            }
        ];

        it('should return all providers', async () => {
            jest.spyOn(repository, 'findAll').mockResolvedValueOnce(providers);

            const result = await service.findAll();

            expect(result).toEqual(providers);
        });
    });

    describe('Create Provider', () => {
        const providerName = 'provider one';

        it('should throw BadRequestException', async () => {
            jest.spyOn(repository, 'findByName').mockResolvedValueOnce({
                _id: '123',
                name: providerName,
                createdAt: '2024/Aug/19',
                updatedAt: '2024/Aug/19'
            } as Provider);

            expect.assertions(1);
            try {
                await service.create({ name: providerName });
            } catch (err) {
                expect(err).toEqual(new BadRequestException('پرووایدر با این نام وجود دارد'));
            }

        });

        it('should return a newly created provider', async () => {

            jest.spyOn(repository, 'create').mockResolvedValueOnce({
                _id: '123',
                name: providerName,
                createdAt: '2024/Aug/19',
                updatedAt: '2024/Aug/19'
            } as Provider);

            const result = await service.create({ name: providerName });

            expect(result).toEqual({
                message: 'پرووایدر با موفقیت ساخته شد',
                data: {
                    _id: '123',
                    name: providerName,
                    createdAt: '2024/Aug/19',
                    updatedAt: '2024/Aug/19'
                } as Provider
            });
        });

    });

});

