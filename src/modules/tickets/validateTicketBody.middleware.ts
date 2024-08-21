import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";


export class ValidateTicketBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { title, issue, priority, groupId, providerId, workspaceId, attachment } = req.body;

        // if (typeof (title) !== 'string' || title.length < 5 || title.length > 70) throw new BadRequestException('invalid title');

        // if (typeof (issue) !== 'string' || issue.length < 15 || issue.length > 400) throw new BadRequestException('invalid issue');

        // if (typeof (priority) !== 'number' || priority > 2) throw new BadRequestException('invalid priority');

        // if (!mongoose.Types.ObjectId.isValid(groupId)) throw new BadRequestException('invalid groupId');

        // if (!mongoose.Types.ObjectId.isValid(providerId)) throw new BadRequestException('invalid providerId');

        // if (workspaceId && typeof (workspaceId) !== 'number') throw new BadRequestException('invalid workspaceId');

        // if (attachment && typeof (attachment) !== 'string') throw new BadRequestException('invalid attachment');

        next();
    }
}