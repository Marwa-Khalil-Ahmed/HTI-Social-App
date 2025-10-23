"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const types_1 = require("../../utils/errors/types");
const user_repo_1 = require("../../DB/repos/user.repo");
const hash_1 = require("../../utils/security/hash");
const successHandler_1 = require("../../utils/successHandler");
const generateHTML_1 = require("../../utils/email/generateHTML");
const createOTP_1 = require("../../utils/email/createOTP");
const email_events_1 = require("../../utils/email/email.events");
class AuthServices {
    userModel = new user_repo_1.UserRepo();
    signUp = async (req, res, next) => {
        const { firstName, lastName, email, password, age, phone } = req.body;
        const isEmailExist = await this.userModel.findByEmail({ email });
        if (isEmailExist) {
            throw new types_1.ApplicationError("email already exist", 400);
        }
        const otp = (0, createOTP_1.createOTP)();
        const user = await this.userModel.create({
            doc: {
                firstName,
                lastName,
                email,
                password: await (0, hash_1.hash)(password),
                age: age,
                phone: phone,
                emailOtp: {
                    otp: await (0, hash_1.hash)(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000),
                },
            },
        });
        const html = (0, generateHTML_1.template)({
            code: otp,
            name: `${firstName} ${lastName}`,
            subject: "Verify your email",
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
            to: email,
            subject: "Verify your email",
            html,
        });
        return (0, successHandler_1.successHandler)({ res, data: user });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.NotFoundExcetion("email not found");
        }
        if (user.isVerified) {
            throw new types_1.ApplicationError("email already verified", 400);
        }
        if (!user.emailOtp.otp) {
            throw new types_1.ApplicationError("otp not found", 400);
        }
        const isExpired = user.emailOtp.expiredAt <= new Date(Date.now());
        if (isExpired) {
            throw new types_1.OtpExpiredExcetion();
        }
        const isValidOtp = await (0, hash_1.compare)(otp, user.emailOtp.otp);
        if (!isValidOtp) {
            throw new types_1.NotFoundExcetion();
        }
        await user.updateOne({
            $unset: {
                emailOtp: "",
            },
            isVerified: true,
        });
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.AuthServices = AuthServices;
