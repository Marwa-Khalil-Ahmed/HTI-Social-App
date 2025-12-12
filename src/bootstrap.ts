import express, { NextFunction, Request, Response } from "express";
import router from "./modules/routes";
import { IError } from "./utils/errors/error.types";
import { DBconnection } from "./DB/config/connectDB";
import { sendEmail } from "./utils/email/send.email";
import { EMAIL_EVENTS, emailEmitter } from "./utils/email/email.events";
import { UserRepo } from "./DB/repos/user.repo";
import { IUser } from "./modules/userModule/user.types";
import cors from 'cors'
import { UserModel } from "./DB/models/user.model";
import { fi } from "zod/v4/locales";
import { lowercase } from "zod/v4/core/regexes.cjs";
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { createHandler } from "graphql-http";
import { userType } from "./utils/graphql.type";
import {schema} from "./modules/graphql/main.graphql";

const app = express();
const bootstrap = async () => {
    app.use(cors())
    app.use(express.json());
    app.use('/api/v1', router)
    const port = process.env.PORT || 5000;

    

    app.all('/graphQl', createHandler({
        schema,context:(req)=>({
            user:req.raw.headers.authorization
        })
    }))


    await DBconnection()

    app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
        console.log({ err });

        res.status(err.statusCode || 500).json({
            message: err.message,
            stack: err.stack,
            status: err.statusCode || 500
        })
    })


    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}
export default bootstrap;