import { Router } from "express";
import { AuthServices } from "./auth.services";
import validation from "../../middleware/validation.middleware";
import { confirmEmailSchema, signupSchema } from "./auth.validation";
const router = Router();

const authServices = new AuthServices();

router.post("/signup", validation(signupSchema), authServices.signUp);

router.post(
  "/confirmEmail",
  validation(confirmEmailSchema),
  authServices.confirmEmail
);

export default router;
