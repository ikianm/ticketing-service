import { Injectable } from "@nestjs/common";
import { IBaseRepository } from "../shares/base-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment } from "./comment.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentsRepository implements IBaseRepository<Comment> {

    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<Comment>
    ) { }

    async create(data: Comment): Promise<Comment> {
        const comment = await this.commentModel.create(data);
        return await comment.save();
    }

    async findById(id: ObjectId): Promise<Comment> {
        return await this.commentModel.findById(id);
    }

}