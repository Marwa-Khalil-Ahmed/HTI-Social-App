"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOTP = void 0;
const nanoid_1 = require("nanoid");
const createOTP = () => {
    const otp = (0, nanoid_1.customAlphabet)("0123456789")(6);
    return otp;
};
exports.createOTP = createOTP;
