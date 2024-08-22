import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, Req, Res, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { FindTicketResponses } from "./swaggerResponses/find-ticket-responses";
import { TicketResponse } from "./swaggerResponses/ticket-response";
import { TicketBodyValidationInterceptor } from "./ticketBodyValidation.interceptor";

@ApiTags('Tickets')
@ApiBearerAuth('access-token')
@Controller('/tickets')
export class TicketsController {

    constructor(
        private readonly ticketsService: TicketsService
    ) { }

    @ApiQuery({
        name: 'page',
        required: false
    })
    @ApiQuery({
        name: 'limit',
        required: false
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiOkResponse({
        description: 'tickets found successfully',
        type: FindTicketResponses,
        isArray: true
    })
    @Get()
    findAll(@Query() requestQuery: PaginateQueryDto) {
        return this.ticketsService.findAll(requestQuery);
    }

    @ApiQuery({
        name: 'serial',
        type: 'string',
        required: true
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'not a ticketing admin' })
    @ApiNotFoundResponse({ description: 'ticket not found' })
    @ApiOkResponse({
        description: 'tickets found successfully',
        type: FindTicketResponses,
        isArray: true
    })
    @Get('/find')
    @UseGuards(IsAdminGuard)
    findBySerial(@Query() serialQuery: SerialQuery) {
        return this.ticketsService.findBySerial(serialQuery);
    }


    @ApiQuery({
        name: 'page',
        required: false
    })
    @ApiQuery({
        name: 'limit',
        required: false
    })
    @ApiQuery({
        name: 'groupName',
        required: true
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiForbiddenResponse({ description: 'not a ticketing admin' })
    @ApiBadRequestResponse({ description: 'group not found' })
    @ApiOkResponse({
        description: 'tickets found successfully',
        type: FindTicketResponses,
        isArray: true
    })
    @Get('/newTicketsAsGroup')
    @UseGuards(IsAdminGuard)
    findAllNewTicketsAsGroup(@Query() requestQuery: PaginateQueryDto & GroupNameQueryDto) {
        return this.ticketsService.findAllNewTicketsAsGroup(requestQuery);
    }


    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiBadRequestResponse({ description: 'id is invalid' })
    @ApiNotFoundResponse({ description: 'no ticket found' })
    @ApiOkResponse({
        description: 'tickets found successfully',
        type: FindTicketResponses,
    })
    @Get('/:id')
    findOne(@Param('id') id: ObjectId) {
        return this.ticketsService.findOneById(id);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateTicketDto })
    @ApiCreatedResponse({
        description: 'comment created successfully',
        type: TicketResponse
    })
    @ApiBadRequestResponse({ description: 'groupId is not valid' })
    @ApiBadRequestResponse({ description: 'providerId is not valid' })
    @ApiBadRequestResponse({ description: 'no access to the workspace' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @UseInterceptors(FileInterceptor('attachment', {
        storage,
        limits: { fileSize: 1024 * 1024 * 1 },
        fileFilter
    }), TicketBodyValidationInterceptor)
    @Post()
    create(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() createTicketDto: CreateTicketDto
    ) {
        if (!file) req.body.attachment = undefined;
        else req.body.attachment = file.path;
        if (req.fileError) throw new UnsupportedMediaTypeException(req.fileError);

        createTicketDto.attachment = file ? file.path : undefined;
        return this.ticketsService.create(createTicketDto);
    }


    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiBadRequestResponse({ description: 'id is not valid or ticket is closed already' })
    @ApiNotFoundResponse({ description: 'no ticket found' })
    @ApiForbiddenResponse({ description: 'neither the creator of the ticket nor ticketing admin' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiOkResponse({
        description: 'ticket closed successfully',
        type: TicketResponse
    })
    @Put('/close/:id')
    close(@Param('id') id: ObjectId) {
        return this.ticketsService.close(id);
    }

    @ApiParam({
        name: 'id',
        type: 'string',
        example: '66b9c9b8b31f096cc79e1211',
        required: true
    })
    @ApiForbiddenResponse({ description: 'neither the creator of the ticket nor ticketing admin' })
    @ApiUnauthorizedResponse({ description: 'not logged in' })
    @ApiBadRequestResponse({ description: 'id is not valid or ticket has no attachment' })
    @ApiNotFoundResponse({ description: 'no ticket found' })
    @ApiOkResponse({ description: 'attachment downloaded successfully' })
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