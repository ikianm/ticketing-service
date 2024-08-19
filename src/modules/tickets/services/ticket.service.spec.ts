import { GroupsApiService } from '../../groups/services/groupapi.service';
import { TicketsRepository } from "../ticket.repository";
import { TicketsService } from "./ticket.service";
import { TicketsValidationsService } from "./ticketvalidation.service";
import { Test } from "@nestjs/testing";


describe('TicketsService', () => {

    let ticketsService: TicketsService;
    let ticketsRepository: TicketsRepository;
    let groupsApiService: GroupsApiService;
    let ticketsValidationService: TicketsValidationsService;

    beforeEach(async () => {
        const fakeTicketsRepository: Partial<TicketsRepository> = {};
        const fakeGroupsApiService: Partial<GroupsApiService> = {};
        const fakeTicketsValidationService: Partial<TicketsValidationsService> = {};

        const module = await Test.createTestingModule({
            providers: [
                TicketsService,
                {
                    provide: TicketsRepository,
                    useValue: fakeTicketsRepository
                },
                {
                    provide: GroupsApiService,
                    useValue: fakeGroupsApiService
                },
                {
                    provide: TicketsValidationsService,
                    useValue: fakeTicketsValidationService
                }
            ]
        }).compile();

        ticketsService = module.get(TicketsService);
        ticketsRepository = module.get(TicketsRepository);
        groupsApiService = module.get(GroupsApiService);
        ticketsValidationService = module.get(TicketsValidationsService);
    });

    it('should be defined', () => {
        expect(ticketsService).toBeDefined();
    });
});