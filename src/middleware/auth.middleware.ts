import { JwtPayload } from "jsonwebtoken"
import { InvalidTokenException, UserNotFoundException } from "../utils/errors/errors.exceptions"
import { verifyToken } from "../utils/security/token"
import { UserRepo } from "../DB/repos/user.repo"
import { NextFunction, Request, Response } from "express"

export enum tokenTypesEnum {
    ACCESS = "access",
    REFRESH = "refresh"
}
const userModel=new UserRepo()
export const decodeToken = async ({
    authorization,
    tokenTypes
}: {
    authorization: string,
    tokenTypes?: tokenTypesEnum
}) => {
    if (!authorization) {
        console.log("1");
        
        throw new InvalidTokenException()
    }
    if (!authorization.startsWith(process.env.BEARER as string)) {
        console.log("2");
        
        throw new InvalidTokenException()
    }

    const token:string = authorization.split(" ")[1] as string
    const payload: JwtPayload = verifyToken({
        token,
        signature: tokenTypes == tokenTypesEnum.ACCESS ?
            process.env.ACCESS_SIGNATURE as string
            : process.env.REFRESH_SIGNATURE as string
    })
    
    const user=await userModel.findById({id:payload._id})   
    if(!user){
        console.log("3");
        
        throw new InvalidTokenException()
    }
    if(!user.isConfirmed){
        console.log("4");
        
        throw new InvalidTokenException()
    }
    return user
}
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
  const data=await decodeToken({
            authorization:req.headers.authorization as string,
            tokenTypes:tokenTypesEnum.ACCESS
        })
    res.locals.user=data
        return next()
}
export const graphqlAuth=async(authorization:string)=>{
  const data=await decodeToken({
            authorization:authorization,
            tokenTypes:tokenTypesEnum.ACCESS
        })
    return data
}