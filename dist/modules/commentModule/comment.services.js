"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommenrServices = void 0;
const comment_repo_1 = require("../../DB/repos/comment.repo");
const post_repo_1 = require("../../DB/repos/post.repo");
const successHandler_1 = require("../../utils/successHandler");
const post_model_1 = require("../../DB/models/post.model");
class CommenrServices {
    postModel = new post_repo_1.PostRepo;
    commentsModel = new comment_repo_1.CommentRepo;
    createComment = async (req, res) => {
        const { content, id } = req.body;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not Found");
        }
        const comment = await this.commentsModel.create({
            doc: {
                content,
                post: post._id,
                createdBy: user._id
            }
        });
        await post.updateOne({
            $push: {
                comments: comment._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    freezeComment = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (comment.isFrozen) {
            throw new Error("Comment Already Frozen");
        }
        await comment.updateOne({
            isFrozen: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        const post = await post_model_1.PostModel.findById(comment.post);
        if (comment.isFrozen) {
            throw new Error("Your comment is frozen,try again later");
        }
        await comment.deleteOne({ comment });
        await post?.updateOne({
            $pull: {
                comments: comment._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    updateComment = async (req, res) => {
        const { id } = req.params;
        const { newContent } = req.body;
        const comment = await this.commentsModel.findById({ id });
        const user = res.locals.user;
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (!user) {
            throw new Error("can not edit someone else's comment");
        }
        if (comment.isFrozen) {
            throw new Error("your comment is frozen right now");
        }
        await comment.updateOne({
            content: newContent
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    getCommentById = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment not found");
        }
        return (0, successHandler_1.successHandler)({ res, data: comment });
    };
}
exports.CommenrServices = CommenrServices;
