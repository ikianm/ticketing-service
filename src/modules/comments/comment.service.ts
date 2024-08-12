import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comment.repository";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { readFileSync, unlinkSync } from "fs";
import mongoose from "mongoose";
import { TicketsApiService } from "src/modules/tickets/services/ticketapi.service";
import { TicketStatusEnum } from "src/modules/tickets/enums/ticket-status.enum";
import { Comment } from "./comment.schema";
import { ObjectId } from "mongodb";
import { join } from "path";


@Injectable()
export class CommentsService {

    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly ticketsApiService: TicketsApiService
    ) { }

    async create(createCommentDto: CreateCommentDto & { attachment?: string }): Promise<Comment> {
        const { content, attachment, ticketId } = createCommentDto;

        // const adminUserAccess =
        //     req.user.resource_access[process.env.KEYCLOAK_ADMIN_CLIENT];


        const isValidObjectId = mongoose.Types.ObjectId.isValid(ticketId);
        if (!isValidObjectId) {
            await this.deleteFile(attachment);
            throw new BadRequestException('شناسه کامنت نامعتبر است');
        }

        const ticket = await this.ticketsApiService.findById(ticketId);
        if (!ticket) {
            await this.deleteFile(attachment);
            throw new NotFoundException('کامنت یافت نشد');
        }

        if (ticket.status === TicketStatusEnum.CLOSED) {
            await this.deleteFile(attachment);
            throw new BadRequestException('تیکت بسته شده است');
        }

        const commentObj: Comment = {
            attachment: attachment || '',
            content,
            userId: 'test', //req.user,sub
            isAdminComment: false, //adminUserAccess
            //? adminUserAccess.roles.includes('Ticketing')
            // : false,
            seenByAdmin: false, //adminUserAccess
            //? adminUserAccess.roles.includes('Ticketing')
            //: false,
            seenByUser: false, //adminUserAccess
            //? !adminUserAccess.roles.includes('Ticketing')
            //: true,
            ticketId
        };

        return await this.commentsRepository.create(commentObj);

    }

    async seenByUser(id: ObjectId): Promise<{ statusCode: number }> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException('کامنت یافت نشد');

        comment.seenByUser = true;
        await this.commentsRepository.create(comment);

        return { statusCode: 200 };
    }

    async seenByAdmin(id: ObjectId): Promise<{ statusCode: number }> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException('کامنت یافت نشد');

        comment.seenByAdmin = true;
        await this.commentsRepository.create(comment);

        return { statusCode: 200 };
    }

    async download(id: ObjectId) {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const ticket = await this.commentsRepository.findById(id);
        if (!ticket) throw new BadRequestException('کامنتی با آیدی ارسال شده یافت نشد');

        if (!ticket.attachment) throw new BadRequestException('تیکت فایلی ندارد');

        const pathOfFile = join(process.cwd(), ticket.attachment);

        return readFileSync(pathOfFile);
    }

    async deleteFile(path: string): Promise<void> {
        unlinkSync(path);
    }

}


