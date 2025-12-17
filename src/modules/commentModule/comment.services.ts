import { Request, Response } from "express";
import { CommentRepo } from "../../DB/repos/comment.repo";
import { PostRepo } from "../../DB/repos/post.repo";
import { UserRepo } from "../../DB/repos/user.repo";
import { successHandler } from "../../utils/successHandler";
import { HUserDocument } from "../userModule/user.types";
import { PostModel } from "../../DB/models/post.model";
export class CommenrServices {

    private readonly postModel = new PostRepo
    private readonly commentsModel = new CommentRepo

    createComment = async (req: Request, res: Response) => {
        const { content, id } = req.body as { content: string, id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!post) {
            throw new Error("Post Not Found");
        }
        const comment = await this.commentsModel.create({
            doc: {
                content,
                post: post._id,
                createdBy: user._id
            }
        })
        await post.updateOne({
            $push: {
                comments: comment._id
            }
        })
        return successHandler({ res })
    }

    freezeComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (comment.isFrozen) {
            throw new Error("Comment Already Frozen");
        }
        await comment.updateOne({
            isFrozen: true
        })
        return successHandler({ res })
    }

    deleteComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        const post = await PostModel.findById(comment.post)
        if (comment.isFrozen) {
            throw new Error("Your comment is frozen,try again later");
        }

        await comment.deleteOne({ comment })
        await post?.updateOne({
            $pull: {
                comments: comment._id
            }
        })
        return successHandler({ res })
    }
    
    updateComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const { newContent } = req.body
        const comment = await this.commentsModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (!user) {
            throw new Error("can not edit someone else's comment");

        }
        if(comment.isFrozen){
            throw new Error("your comment is frozen right now");
            
        }
        await comment.updateOne({
            content: newContent
        })
        return successHandler({ res })
    }
  
    getCommentById = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment not found");
        }
        return successHandler({ res, data: comment })
    }
}