import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import mongoose from "mongoose";
import { Observable } from "rxjs";
const fs = require('node:fs');

@Injectable()
export class TicketBodyValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        
        const { title, issue, priority, groupId, providerId, workspaceId } = req.body;
        const uploadedFilePath = req.file?.path;

        const validateString = (value: string, fieldName: string, minLength: number, maxLength: number): void => {
            if (typeof value !== 'string' || value.length < minLength || value.length > maxLength) {
                req.file && fs.unlinkSync(uploadedFilePath);
                throw new BadRequestException(`invalid ${fieldName}, must be a string between ${minLength} and ${maxLength} length`);
            }
        };

        const validatePriority = (value: string): void => {
            const parsedPriority = parseInt(value);
            if (isNaN(parsedPriority) || parsedPriority < 0 || parsedPriority > 2) {
                req.file && fs.unlinkSync(uploadedFilePath);
                throw new BadRequestException('invalid priority, must be 0, 1 or 2');
            }
            req.body.priority = parsedPriority;
        };

        const validateWorkspaceId = (value: string | undefined): void => {
            if (value) {
                const parsedWorkspaceId = parseInt(value);
                if (isNaN(parsedWorkspaceId)) {
                    req.file && fs.unlinkSync(uploadedFilePath);
                    throw new BadRequestException('invalid workspaceId');
                }
                req.body.workspaceId = parsedWorkspaceId;
            }
        }

        const validateObjectId = (value: string, fieldName: string): void => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                req.file && fs.unlinkSync(uploadedFilePath);
                throw new BadRequestException(`invalid ${fieldName}, must be an objectId`);
            }
        };

        validateString(title, 'title', 5, 70);
        validateString(issue, 'issue', 15, 400);
        validatePriority(priority);
        validateWorkspaceId(workspaceId);
        validateObjectId(groupId, 'groupId');
        validateObjectId(providerId, 'providerId');


        return next.handle();

    }
}