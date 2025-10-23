import { customAlphabet } from "nanoid";

export const createOTP = () => {
  const otp = customAlphabet("0123456789")(6);
  return otp;
};
