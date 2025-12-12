import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql"
import { HydratedDocument } from "mongoose"

export interface IUser {
    firstName:string
    lastName:string
    email: string
    password: string
    age:number
    phone:string
    profileImage:string
    covserImages:string[]
    folderId:string
    isConfirmed:boolean
    changedCredentialsAt:Date
    emailOtp:{
        otp:string,
        expiredAt:Date
    }
     passOtp:{
        otp:string,
        expiredAt:Date
    }
    twoStepVerification:{
        enabled:boolean,
        otp:string,
        expiredAt:Date
    }
    loginConfirmation:{
        otp:string,
        expiredAt:Date
    }
}

export const userType = new GraphQLObjectType({
    name:"userType",
    fields:{
        _id:{type:GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt},
    }
}) 

export type HUserDocument=HydratedDocument<IUser>