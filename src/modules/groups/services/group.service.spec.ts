import { Test, TestingModule } from "@nestjs/testing";
import { GroupsService } from "./group.service"
import { GroupsRepository } from "../group.repository";
import { BadRequestException } from "@nestjs/common";
import { Group } from "../group.schema";


describe('GroupsService', () => {
    let service: GroupsService;
    let repository: GroupsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupsService,
                {
                    provide: GroupsRepository,
                    useValue: {
                        findByName: jest.fn(),
                        create: jest.fn(),
                        findAll: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<GroupsService>(GroupsService);
        repository = module.get<GroupsRepository>(GroupsRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Create Group', () => {
        const groupName = 'group one';

        it('should throw BadRequestException', async () => {
            jest.spyOn(repository, 'findByName')
                .mockResolvedValueOnce({
                    name: groupName
                });

            await expect(service.create({ name: groupName }))
                .rejects.toEqual(new BadRequestException('گروه با این نام وجود دارد'));
        });

        it('should return a newly created group', async () => {

            jest.spyOn(repository, 'findByName')
                .mockResolvedValueOnce(undefined);

            jest.spyOn(repository, 'create')
                .mockResolvedValueOnce({
                    _id: '1234',
                    name: groupName,
                    createdAt: '2024/Aug/19',
                    updateAt: '2024/Aug/19'
                } as Group);

            const result = await service.create({ name: groupName });

            expect(result).toEqual({
                message: 'گروه با موفقیت ساخته شد',
                data: {
                    _id: '1234',
                    name: groupName,
                    createdAt: '2024/Aug/19',
                    updateAt: '2024/Aug/19'
                }
            });
        });

        describe('FindAll Groups', () => {

            const groups = [
                {
                    _id: '1',
                    name: 'group one',
                    createdAt: '2024/Aug/19',
                    upadtedAt: '2024/Aug/20'
                } as Group,
                {
                    _id: '2',
                    name: 'group two',
                    createdAt: '2024/Aug/19',
                    upadtedAt: '2024/Aug/20'
                } as Group,
                {
                    _id: '3',
                    name: 'group three',
                    createdAt: '2024/Aug/19',
                    upadtedAt: '2024/Aug/20'
                } as Group
            ];

            it('should find all groups', async () => {
                jest.spyOn(repository, 'findAll')
                    .mockResolvedValueOnce(groups);

                const result = await service.findAll();

                expect(result).toEqual(groups);
            });
        });
    });
});