import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TicketsRepository } from "../ticket.repository";
import { PaginateQueryDto } from "../../shares/dtos/paginateQuery.dto";
import { GroupNameQueryDto } from "../dtos/groupnameQuery.dto";
import { GroupsApiService } from "../../groups/services/groupapi.service";
import { Ticket } from "../ticket.schema";
import mongoose from "mongoose";
import { CreateTicketDto } from "../dtos/create-ticket.dto";
import { TicketsValidationsService } from "./ticketvalidation.service";
import { unlinkSync, readFileSync } from "fs";
import { TicketStatusEnum } from "../enums/ticket-status.enum";
import { generate } from "randomstring";
import { ResponseMessageDto } from "src/modules/shares/dtos/response-message.dto";
import { ObjectId } from "mongodb";
import { SerialQuery } from "../dtos/serialQuery.dto";
import { join } from "node:path";
import AppConfig from "configs/app.config";
import { InvalidWorkspaceEnum } from "../enums/invalid-workspace.enum";
import { RequestContextService } from "src/modules/shares/appRequestContext";


@Injectable()
export class TicketsService {

    constructor(
        private readonly ticketsRepository: TicketsRepository,
        private readonly groupsApiService: GroupsApiService,
        private readonly ticketsValidationService: TicketsValidationsService
    ) { }

    async findAll(requestQuery: PaginateQueryDto) {
        let { page, limit } = requestQuery;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        const ticketsToSkip = (page - 1) * limit;

        const tickets = await this.ticketsRepository.findAll({ skip: ticketsToSkip, limit });

        return tickets;
    }

    async findAllNewTicketsAsGroup(requestQuery: PaginateQueryDto & GroupNameQueryDto) {
        let { groupName, limit, page } = requestQuery;
        page = page ? page : 1;
        limit = limit ? limit : 10;
        const ticketsToSkip = (page - 1) * limit;

        const group = await this.groupsApiService.findByName(groupName);
        if (!group && groupName !== 'all') throw new BadRequestException('نام گروه معتبر نیست');

        const tickets = await this.ticketsRepository.findAllNewTicketsAsGroup({
            groupName,
            skip: ticketsToSkip,
            limit
        });

        return tickets;
    }

    async findOneById(id: ObjectId): Promise<Ticket> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه تیکت صحیح نمیباشد')

        const ticket = await this.ticketsRepository.findById(id);
        if (!ticket) throw new NotFoundException('تیکت با آیدی ارسال شده یافت نشد');

        return ticket;
    }

    async create(createTicketDto: CreateTicketDto & { attachment?: string }): Promise<ResponseMessageDto<Ticket>> {
        const { issue, priority, title, attachment, groupId, providerId, workspaceId } = createTicketDto;

        const isGroupValid = await this.ticketsValidationService.validateGroup(groupId);
        if (!isGroupValid) {
            if (attachment) await this.deleteFile(attachment);
            throw new BadRequestException('شناسه گروه معتبر نیست');
        }

        const isProviderIdValid = await this.ticketsValidationService.validateProvider(providerId);
        if (!isProviderIdValid) {
            if (attachment) await this.deleteFile(attachment);
            throw new BadRequestException('شناسه پرووایدر معتبر نیست');
        }

        if (workspaceId) {
            const { isWorkspaceValid, error } = await this.ticketsValidationService.checkWorkspaceAccess(workspaceId);
            if (!isWorkspaceValid) {
                if (attachment) await this.deleteFile(attachment);

                if (error === InvalidWorkspaceEnum.INTERNAL_SERVER_ERROR) throw new InternalServerErrorException(AppConfig().internalServerErrorMessage);
                else throw new BadRequestException('عدم دسترسی به میزکار');
            }
        }

        const user = RequestContextService.getUserInfo();

        const ticketObj: Ticket = {
            attachment: attachment ? attachment : '',
            group: groupId,
            provider: providerId,
            issue,
            priority,
            status: TicketStatusEnum.NEW,
            serial: generate({ length: 8, charset: 'numeric' }),
            title,
            workspaceId,
            userId: user.id
        };

        const ticket = await this.ticketsRepository.create(ticketObj);

        const savedTicket = await this.ticketsRepository.populatedFindById(ticket._id);

        return {
            data: savedTicket,
            message: 'تیکت با موفقیت ساخته شد'
        };

    }

    async deleteFile(path: string): Promise<void> {
        if (path) unlinkSync(path);
    }

    async findBySerial(serialQuery: SerialQuery): Promise<Ticket> {
        const { serial } = serialQuery;
        const ticket = await this.ticketsRepository.findBySerial(serial);
        if (!ticket) throw new NotFoundException('تیکت با سریال ارسال شده یافت نشد');

        return ticket;
    }

    async close(id: ObjectId): Promise<ResponseMessageDto<Ticket>> {
        const isIdValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isIdValidObjectId) throw new BadRequestException('شناسه معتبر نیست');

        const ticket = await this.ticketsRepository.findById(id);
        if (!ticket) throw new NotFoundException('تیکتی با آیدی ارسال شده یافت نشد');
        if (ticket.status === TicketStatusEnum.CLOSED) throw new BadRequestException('تیکت قبلا بسته شده');

        const user = RequestContextService.getUserInfo();
        if (user.id !== ticket.userId && !user.isAdmin) {
            throw new ForbiddenException('عدم دسترسیی به تیکت');
        }

        ticket.status = TicketStatusEnum.CLOSED;
        const closedTicket = await this.ticketsRepository.create(ticket);

        return {
            data: closedTicket,
            message: 'تیکت بسته شد'
        };
    }

    async download(id: ObjectId): Promise<Buffer> {
        const isIdValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isIdValidObjectId) throw new BadRequestException('شناسه معتبر نیست');


        const ticket = await this.ticketsRepository.findById(id);
        if (!ticket) throw new NotFoundException('تیکتی با آیدی ارسال شده یافت نشد');

        const user = RequestContextService.getUserInfo();
        if (user.id !== ticket.userId && !user.isAdmin) {
            throw new ForbiddenException('عدم دسترسیی به تیکت');
        }

        if (!ticket.attachment) throw new BadRequestException('تیکت فایلی ندارد');

        const pathOfFile = join(process.cwd(), ticket.attachment);

        return readFileSync(pathOfFile);
    }

}