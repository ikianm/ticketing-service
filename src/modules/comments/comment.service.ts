import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comment.repository";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { readFileSync, unlinkSync } from "node:fs";
import mongoose from "mongoose";
import { TicketsApiService } from "../tickets/services/ticketapi.service";
import { TicketStatusEnum } from "../tickets/enums/ticket-status.enum";
import { Comment } from "./comment.schema";
import { ObjectId } from "mongodb";
import { join } from "node:path";
import { RequestContextService } from "../shares/appRequestContext";
import { ResponseMessageDto } from "../shares/dtos/response-message.dto";


@Injectable()
export class CommentsService {

    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly ticketsApiService: TicketsApiService
    ) { }

    async create(createCommentDto: CreateCommentDto): Promise<ResponseMessageDto<Comment>> {
        const { content, attachment, ticketId } = createCommentDto;

        const ticket = await this.ticketsApiService.findById(ticketId);
        if (!ticket) {
            await this.deleteFile(attachment);
            throw new NotFoundException('تیکت یافت نشد');
        }

        if (ticket.status === TicketStatusEnum.CLOSED) {
            await this.deleteFile(attachment);
            throw new BadRequestException('تیکت بسته شده است');
        }

        const user = RequestContextService.getUserInfo();

        const commentObj: Comment = {
            attachment: attachment || '',
            content,
            userId: user.id,
            isAdminComment: user.isAdmin,
            seenByAdmin: user.isAdmin,
            seenByUser: !user.isAdmin,
            ticketId: new mongoose.Types.ObjectId(ticketId)
        };

        const comment = await this.commentsRepository.create(commentObj);

        return {
            message: 'کامنت با موفقیت ساخته شد',
            data: comment
        }

    }

    async seenByUser(id: ObjectId): Promise<{ statusCode: number }> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException('کامنت یافت نشد');

        comment.seenByUser = true;
        await this.commentsRepository.create(comment);

        return { statusCode: HttpStatus.OK };
    }

    async seenByAdmin(id: ObjectId): Promise<{ statusCode: number }> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException('کامنت یافت نشد');

        comment.seenByAdmin = true;
        await this.commentsRepository.create(comment);

        return { statusCode: HttpStatus.OK };
    }

    async download(id: ObjectId) {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidObjectId) throw new BadRequestException('شناسه نامعتبر است');

        const ticket = await this.commentsRepository.findById(id);
        if (!ticket) throw new NotFoundException('کامنتی با آیدی ارسال شده یافت نشد');

        const user = RequestContextService.getUserInfo();
        if (user.id !== ticket.userId && !user.isAdmin) {
            throw new ForbiddenException('عدم دسترسی به کامنت');
        }

        if (!ticket.attachment) throw new BadRequestException('تیکت فایلی ندارد');

        const pathOfFile = join(process.cwd(), ticket.attachment);

        return readFileSync(pathOfFile);
    }

    async deleteFile(path: string): Promise<void> {
        if (path) unlinkSync(path);
    }

}


