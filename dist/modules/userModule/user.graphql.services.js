"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.hello = void 0;
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const user_validtion_1 = require("./user.validtion");
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
const hello = (_, args) => {
    (0, validation_middleware_1.graphqlValidation)(user_validtion_1.confirmEmailSchema, args);
    return 'hello' + args.name;
};
exports.hello = hello;
const me = (_, args, ctx) => {
    const user = (0, auth_middleware_1.graphqlAuth)(ctx.authorization);
    return user;
};
exports.me = me;
