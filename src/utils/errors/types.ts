import { extend } from "zod/v4/core/util.cjs";

export interface IError extends Error {
  statusCode: number;
}

export class ApplicationError extends Error {
  constructor(
    msg: string,
    public statusCode: number,
    options: ErrorOptions = {}
  ) {
    super(msg, options);
  }
}

export class NotFoundExcetion extends ApplicationError {
  constructor(msg: string = "not found") {
    super(msg, 404);
  }
}

export class OtpExpiredExcetion extends ApplicationError {
  constructor(msg: string = "otp expired") {
    super(msg, 400);
  }
}

export class NotValidOtpExcetion extends ApplicationError {
  constructor(msg: string = "not valid otp") {
    super(msg, 400);
  }
}
