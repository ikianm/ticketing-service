import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CommentsService } from "./comment.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter, storage } from "../shares/file-upload";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatusCode } from "axios";


@Controller('/comments')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('attachment', {
        storage,
        limits: { fileSize: 1024 * 1024 * 1 },
        fileFilter
    }))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() createCommentDto: CreateCommentDto & { attachment?: string }
    ) {
        if (!file) req.body.attachment = undefined;
        else req.body.attachment = file.path;
        if (req.fileError) throw new BadRequestException(req.fileError);

        createCommentDto.attachment = file ? file.path : undefined;
        return this.commentsService.create(createCommentDto);
    }

    @Put('/seenByUser/:id')
    seenByUser(@Param('id') id: ObjectId) {
        return this.commentsService.seenByUser(id);
    }

    //admin protection
    @Put('/seenByAdmin/:id')
    seenByAdmin(@Param('id') id: ObjectId) {
        return this.commentsService.seenByAdmin(id);
    }

    @Get('/download/:id')
    async download(@Res() res: Response, @Param('id') id: ObjectId) {
        const fileBuffer = await this.commentsService.download(id);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment`
        })
            .status(HttpStatusCode.Ok)
            .send(fileBuffer);
    }
}