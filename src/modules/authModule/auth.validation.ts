import z from "zod";

export const signupSchema = z
  .object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    age: z.number().optional(),
    phone: z.string().optional(),
  })
  .superRefine((args, ctx) => {
    if (args.confirmPassword != args.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password", "confirmPassword"],
        message: "password must be equal to confirm password",
      });
    }
    /*if(!args.email.startsWith("anas")){
        ctx.addIssue({
            code:"custom",
            path:["name"],
            message:"must start with 'anas"
        })
    }*/
  });

export const confirmEmailSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});
