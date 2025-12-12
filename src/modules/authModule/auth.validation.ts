import z, { email } from 'zod';


export const signupSchema=z.object({
    email:z.email(),
    firstName:z.string(),
    lastName:z.string(),
    age:z.number().optional(),
    phone:z.string().optional(),
    password:z.string(),
    confirmPassword:z.string()
}).superRefine((args,ctx)=>{
    if(args.password!==args.confirmPassword){
    
        ctx.addIssue({
            code:"custom" ,
            message:"Password don't match",
            path:["password","confirmPassword"]
        })
    }
    
})


export const confirmEmailSchema=z.object({
    email:z.email(),
    otp:z.string().length(6)
})
export const resendOtpSchema=z.object({
    email:z.email()
})
export const loginSchema=z.object({
    email:z.email(),
        password:z.string()
})
export const twoStepVerificationSchema=z.object({
    code:z.string().length(6)
})
export const loginConfirmationSchema=z.object({
    otp:z.string().length(6) 
})