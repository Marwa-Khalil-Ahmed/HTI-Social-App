import { Request, Response, NextFunction } from "express";
import { confirmEmailDto, SignDto } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import z from "zod";
import { Model } from "mongoose";
import { IUser } from "../userModule/user.types";
import { UserModel } from "../../DB/models/user.model";
import {
  ApplicationError,
  NotFoundExcetion,
  OtpExpiredExcetion,
} from "../../utils/errors/types";
import { UserRepo } from "../../DB/repos/user.repo";
import { compare, hash } from "../../utils/security/hash";
import { successHandler } from "../../utils/successHandler";
import { template } from "../../utils/email/generateHTML";
import { createOTP } from "../../utils/email/createOTP";
import {
  EMAIL_EVENTS_ENUM,
  emailEmitter,
} from "../../utils/email/email.events";

export class AuthServices {
  private userModel = new UserRepo();

  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { firstName, lastName, email, password, age, phone }: SignDto =
      req.body;

    const isEmailExist = await this.userModel.findByEmail({ email });
    if (isEmailExist) {
      throw new ApplicationError("email already exist", 400);
    }

    const otp = createOTP();

    const user = await this.userModel.create({
      doc: {
        firstName,
        lastName,
        email,
        password: await hash(password),
        age: age as number,
        phone: phone as string,
        emailOtp: {
          otp: await hash(otp),
          expiredAt: new Date(Date.now() + 30 * 1000),
        },
      },
    });

    const html = template({
      code: otp,
      name: `${firstName} ${lastName}`,
      subject: "Verify your email",
    });

    emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
      to: email,
      subject: "Verify your email",
      html,
    });

    return successHandler({ res, data: user });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: confirmEmailDto = req.body;

    const user = await this.userModel.findByEmail({ email });
    if (!user) {
      throw new NotFoundExcetion("email not found");
    }
    if (user.isVerified) {
      throw new ApplicationError("email already verified", 400);
    }
    if (!user.emailOtp.otp) {
      throw new ApplicationError("otp not found", 400);
    }

    const isExpired = user.emailOtp.expiredAt <= new Date(Date.now());
    if (isExpired) {
      throw new OtpExpiredExcetion();
    }

    const isValidOtp = await compare(otp, user.emailOtp.otp);
    if (!isValidOtp) {
      throw new NotFoundExcetion();
    }
    await user.updateOne({
      $unset: {
        emailOtp: "",
      },
      isVerified: true,
    });

    return successHandler({ res });
  };
}
