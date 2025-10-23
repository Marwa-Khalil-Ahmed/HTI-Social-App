"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotValidOtpExcetion = exports.OtpExpiredExcetion = exports.NotFoundExcetion = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(msg, statusCode, options = {}) {
        super(msg, options);
        this.statusCode = statusCode;
    }
}
exports.ApplicationError = ApplicationError;
class NotFoundExcetion extends ApplicationError {
    constructor(msg = "not found") {
        super(msg, 404);
    }
}
exports.NotFoundExcetion = NotFoundExcetion;
class OtpExpiredExcetion extends ApplicationError {
    constructor(msg = "otp expired") {
        super(msg, 400);
    }
}
exports.OtpExpiredExcetion = OtpExpiredExcetion;
class NotValidOtpExcetion extends ApplicationError {
    constructor(msg = "not valid otp") {
        super(msg, 400);
    }
}
exports.NotValidOtpExcetion = NotValidOtpExcetion;
