"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const user_graphql_controller_1 = require("../userModule/user.graphql.controller");
exports.schema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: "mainQuery",
        fields: {
            ...user_graphql_controller_1.userQuery
        },
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: "mainQuery",
        fields: {
            ...user_graphql_controller_1.userMutation
        },
    }),
});
