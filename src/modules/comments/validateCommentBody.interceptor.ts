import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import mongoose from "mongoose";
import { Observable } from "rxjs";
const fs = require('node:fs');

@Injectable()
export class ValidateCommentBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();

        const { ticketId, content } = req.body;
        const uploadedFilePath = req.file?.path;

        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            req.file && fs.unlinkSync(uploadedFilePath);
            throw new BadRequestException('invalid ticketId');
        }

        if (typeof content !== 'string' || content.length < 15 || content.length > 400) {
            req.file && fs.unlinkSync(uploadedFilePath);
            throw new BadRequestException('invalid content, must be between 15 and 400 length');
        }

        return next.handle();
    }
}