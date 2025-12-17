"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_repo_1 = require("../../DB/repos/user.repo");
const s3_services_1 = require("../../utils/multer/s3.services");
const successHandler_1 = require("../../utils/successHandler");
const friend_request_repo_1 = require("../../DB/repos/friend.request.repo");
const errors_exceptions_1 = require("../../utils/errors/errors.exceptions");
const friend_request_1 = require("../../DB/models/friend.request");
class UserServices {
    userModel = new user_repo_1.UserRepo;
    profileImage = async (req, res) => {
        const file = req.file;
        const user = res.locals.user;
        const path = await (0, s3_services_1.uploadFile)({
            file,
            path: `${user._id}/profileImage`
        });
        user.profileImage = path;
        await user.save();
        return (0, successHandler_1.successHandler)({ res, data: path });
    };
    friendRequestModel = new friend_request_repo_1.FrienddRequestRepo;
    sendFriendRequest = async (req, res) => {
        const { to } = req.body;
        const authUser = res.locals.user;
        const from = authUser._id;
        if (to.toString() == from.toString()) {
            throw new Error("You can't send friend request to yourself");
        }
        if (!await this.userModel.findById({
            id: to
        })) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        const isFriends = await this.friendRequestModel.findOne({
            filter: {
                $or: [
                    { from: from, to: to },
                    { from: to, to: from }
                ]
            }
        });
        if (isFriends) {
            throw new Error("Friend request already sent or you are already friends");
        }
        const friendRequest = await this.friendRequestModel.create({
            doc: {
                from,
                to
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: friendRequest });
    };
    acceptFriendRequest = async (req, res) => {
        const authUser = res.locals.user;
        const { id } = req.params;
        const friendRequest = await this.friendRequestModel.findOne({
            filter: {
                _id: id,
                to: authUser._id,
                acceptedAt: {
                    $exists: false
                }
            }
        });
        if (!friendRequest) {
            throw new Error("Friend request not found");
        }
        await friendRequest.updateOne({
            acceptedAt: new Date()
        });
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.to
            },
            update: {
                $addToSet: {
                    friends: friendRequest.from
                }
            }
        });
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.from
            },
            update: {
                $addToSet: {
                    friends: authUser._id
                }
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: friendRequest });
    };
    deleteFriendRequest = async (req, res) => {
        const { id } = req.params;
        const friendRequest = await friend_request_1.friendRequestModel.findById(id);
        if (!friendRequest) {
            throw new Error("Friend request not found");
        }
        const user = res.locals.user;
        if (friendRequest.from.toString() != user._id.toString() && friendRequest.to.toString() != user._id.toString()) {
            throw new Error("Can't delete someone else's request");
        }
        if (friendRequest.acceptedAt) {
            throw new Error("Friend request accepted");
        }
        await friendRequest.deleteOne(friendRequest._id);
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.UserServices = UserServices;
