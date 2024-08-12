import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./comment.schema";
import { CommentsController } from "./comment.controller";
import { CommentsRepository } from "./comment.repository";
import { CommentsService } from "./comment.service";
import { TicketsModule } from "../tickets/ticket.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        TicketsModule
    ],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService]
})
export class CommentsModule { }