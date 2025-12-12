"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutation = exports.userQuery = void 0;
const graphql_1 = require("graphql");
const user_types_1 = require("./user.types");
const user_graphql_services_1 = require("./user.graphql.services");
exports.userQuery = {
    hello: {
        type: graphql_1.GraphQLString,
        args: {
            name: { type: graphql_1.GraphQLString },
        },
        resolve: user_graphql_services_1.hello,
    },
    me: {
        type: user_types_1.userType,
        resolve: user_graphql_services_1.me,
    },
};
exports.userMutation = {
    hello: {
        type: graphql_1.GraphQLString,
        resolve: () => {
            return "hello";
        },
    },
};
