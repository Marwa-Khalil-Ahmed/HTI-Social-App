import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";
import { ZodObject } from "zod";

const validation = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    const validationResult = await schema.safeParseAsync(data);
    if (!validationResult.success) {
      return res.status(422).json({
        message: "Validation Error",
        errors: JSON.parse(validationResult.error as unknown as string),
      });
    }
    next();
  };
};

export const graphqlValidation = async (schema: ZodObject, args:any) => {
  const validationResult = await schema.safeParseAsync(args);
    if (!validationResult.success) {
      throw new GraphQLError('validation error',{
        extensions:{
            result:JSON.parse(validationResult.error as unknown as string)
        }
      })
    }
};

export default validation;
