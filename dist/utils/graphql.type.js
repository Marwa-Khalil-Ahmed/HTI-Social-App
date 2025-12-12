"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = void 0;
const graphql_1 = require("graphql");
exports.userType = new graphql_1.GraphQLObjectType({
    name: "userData",
    fields: {
        name: {
            type: graphql_1.GraphQLString,
        },
        age: {
            type: graphql_1.GraphQLInt,
        },
    },
});
