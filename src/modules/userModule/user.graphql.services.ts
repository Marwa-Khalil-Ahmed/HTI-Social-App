import { graphqlAuth } from "../../middleware/auth.middleware";
import { graphqlValidation } from "../../middleware/validation.middleware";
import { confirmEmailSchema } from "./user.validtion";

const users = [
  {
    name: "anas",
    age: 10,
  },
  {
    name: "ahmed",
    age: 50,
  },
];

export const hello = (_:any,args:any) => {
    graphqlValidation(confirmEmailSchema,args)
    return 'hello'+args.name
}

export const me = (_:any,args:any,ctx:any) => {
    const user =graphqlAuth(ctx.authorization)
    return user
}