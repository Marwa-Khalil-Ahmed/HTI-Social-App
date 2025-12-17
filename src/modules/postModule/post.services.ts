import { Request, Response } from "express";
import { PostRepo } from "../../DB/repos/post.repo";
import { successHandler } from "../../utils/successHandler";
import { HUserDocument } from "../userModule/user.types";
import { PostModel } from "../../DB/models/post.model";

export class PostServices {
    private readonly postModel = new PostRepo

    createPost = async (req: Request, res: Response) => {
        const {
            content
        } = req.body
        const user = res.locals.user as HUserDocument
        const post = await this.postModel.create({
            doc: {
                createdBy: user._id,
                content,
            }
        })
        await user.updateOne({
            $push: {
                posts: post._id
            }
        })
        return successHandler({ res })
    }
    
    freezePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.isFrozen) {
            throw new Error("Post already frozen");
        }
        await post.updateOne({
            isFrozen: true
        })
        return successHandler({ res })
    }

   
    deletePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (user._id.toString() != post.createdBy.toString()) {
            throw new Error("Can't Delete Someone Else's Post");

        }
        if (post.isFrozen) {
            throw new Error("your post is frozen,try again later");
        }
        if (post?.comments) {
            const postComment = await post.populate({
                path: 'comments',
                select: '_id'
            })

        }
        await PostModel.deleteOne({
            _id: post._id
        })
        await user.updateOne({
            $pull: {
                posts: post._id
            }
        })
        await user.save()
        return successHandler({ res })
    }

   
    updatePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const { newContent } = req.body
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.createdBy.toString() != user._id.toString()) {
            throw new Error("Can not edit somone else's post");
        }
        if(post.isFrozen){
            throw new Error("post is frozen");
            
        }
        await post.updateOne({
            content: newContent
        })
        return successHandler({ res })
    }
   
    getPost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        if (!post) {
            throw new Error("Post Not Found");
        }
        return successHandler({ res, data: post })
    }
    
    
}
