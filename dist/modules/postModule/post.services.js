"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const post_repo_1 = require("../../DB/repos/post.repo");
const successHandler_1 = require("../../utils/successHandler");
const post_model_1 = require("../../DB/models/post.model");
class PostServices {
    postModel = new post_repo_1.PostRepo;
    createPost = async (req, res) => {
        const { content } = req.body;
        const user = res.locals.user;
        const post = await this.postModel.create({
            doc: {
                createdBy: user._id,
                content,
            }
        });
        await user.updateOne({
            $push: {
                posts: post._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    freezePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.isFrozen) {
            throw new Error("Post already frozen");
        }
        await post.updateOne({
            isFrozen: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
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
            });
        }
        await post_model_1.PostModel.deleteOne({
            _id: post._id
        });
        await user.updateOne({
            $pull: {
                posts: post._id
            }
        });
        await user.save();
        return (0, successHandler_1.successHandler)({ res });
    };
    updatePost = async (req, res) => {
        const { id } = req.params;
        const { newContent } = req.body;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.createdBy.toString() != user._id.toString()) {
            throw new Error("Can not edit somone else's post");
        }
        if (post.isFrozen) {
            throw new Error("post is frozen");
        }
        await post.updateOne({
            content: newContent
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    getPost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        if (!post) {
            throw new Error("Post Not Found");
        }
        return (0, successHandler_1.successHandler)({ res, data: post });
    };
}
exports.PostServices = PostServices;
