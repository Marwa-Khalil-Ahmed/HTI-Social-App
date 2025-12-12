"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlValidation = void 0;
const graphql_1 = require("graphql");
const validation = (schema) => {
    return async (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
        };
        const validationResult = await schema.safeParseAsync(data);
        if (!validationResult.success) {
            return res.status(422).json({
                message: "Validation Error",
                errors: JSON.parse(validationResult.error),
            });
        }
        next();
    };
};
const graphqlValidation = async (schema, args) => {
    const validationResult = await schema.safeParseAsync(args);
    if (!validationResult.success) {
        throw new graphql_1.GraphQLError('validation error', {
            extensions: {
                result: JSON.parse(validationResult.error)
            }
        });
    }
};
exports.graphqlValidation = graphqlValidation;
exports.default = validation;
