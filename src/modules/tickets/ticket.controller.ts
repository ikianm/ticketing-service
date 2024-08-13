import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { TicketsService } from "./services/ticket.service";
import { PaginateQueryDto } from "../shares/dtos/paginateQuery.dto";
import { GroupNameQueryDto } from "./dtos/groupnameQuery.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter, storage } from "../shares/file-upload";
import { Request, Response } from "express";
import { CreateTicketDto } from "./dtos/create-ticket.dto";
import { ObjectId } from "mongodb";
import { SerialQuery } from "./dtos/serialQuery.dto";
import { HttpStatusCode } from "axios";
import { IsAdminGuard } from "../shares/isAdmin.guard";

@Controller('/tickets')
export class TicketsController {

    constructor(
        private readonly ticketsService: TicketsService
    ) { }

    @Get()
    findAll(@Query() requestQuery: PaginateQueryDto) {
        return this.ticketsService.findAll(requestQuery);
    }

    @Get('/find')
    @UseGuards(new IsAdminGuard())
    findBySerial(@Query() serialQuery: SerialQuery) {
        return this.ticketsService.findBySerial(serialQuery);
    }

    @Get('/newTicketsAsGroup')
    @UseGuards(new IsAdminGuard())
    findAllNewTicketsAsGroup(@Query() requestQuery: PaginateQueryDto & GroupNameQueryDto) {
        return this.ticketsService.findAllNewTicketsAsGroup(requestQuery);
    }

    @Get('/:id')
    findOne(@Param('id') id: ObjectId) {
        return this.ticketsService.findOneById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('attachment', {
        storage,
        limits: { fileSize: 1024 * 1024 * 1 },
        fileFilter
    }))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() createTicketDto: CreateTicketDto & { attachment?: string }
    ) {
        if (!file) req.body.attachment = undefined;
        else req.body.attachment = file.path;
        if (req.fileError) throw new BadRequestException(req.fileError);

        createTicketDto.attachment = file ? file.path : undefined;

        return this.ticketsService.create(createTicketDto);
    }

    @Put('/close/:id')
    close(@Param('id') id: ObjectId) {
        return this.ticketsService.close(id);
    }

    @Get('/download/:id')
    async download(@Res() res: Response, @Param('id') id: ObjectId) {
        const fileBuffer = await this.ticketsService.download(id);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment`
        });

        res
            .status(HttpStatusCode.Ok)
            .send(fileBuffer);
    }

}