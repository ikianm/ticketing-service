import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommentsService } from "./comment.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter, storage } from "../shares/file-upload";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatusCode } from "axios";
import { IsAdminGuard } from "../shares/isAdmin.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CommentResponse } from "./swaggerRespnses/comment-response";


@ApiTags('Comments')
@ApiBearerAuth('access-token')
@Controller('/comments')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateCommentDto })
    @ApiCreatedResponse({
        description: 'comment created successfully',
        type: CommentResponse
    })
    @ApiBadRequestResponse({ description: 'id is not valid' })
    @ApiBadRequestResponse({ description: 'comment is closed' })
    @ApiNotFoundResponse({ description: 'ticket not found' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
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

    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiOkResponse({ description: 'seen by user successfull' })
    @ApiBadRequestResponse({ description: 'id is not valid' })
    @ApiNotFoundResponse({ description: 'comment not found' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @Put('/seenByUser/:id')
    seenByUser(@Param('id') id: ObjectId) {
        return this.commentsService.seenByUser(id);
    }

    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiOkResponse({ description: 'seen by user successfull' })
    @ApiBadRequestResponse({ description: 'id is not valid' })
    @ApiNotFoundResponse({ description: 'comment not found' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'not a ticketing admin' })
    @Put('/seenByAdmin/:id')
    @UseGuards(IsAdminGuard)
    seenByAdmin(@Param('id') id: ObjectId) {
        return this.commentsService.seenByAdmin(id);
    }

    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiBadRequestResponse({ description: 'id is not valid' })
    @ApiNotFoundResponse({ description: 'comment not found' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'neither creator of the comment nor a ticketing admin' })
    @ApiBadRequestResponse({ description: 'no attachment available for this comment' })
    @ApiOkResponse({description: 'attachment downloaded successfully'})
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