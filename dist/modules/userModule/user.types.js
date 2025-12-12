"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = void 0;
const graphql_1 = require("graphql");
exports.userType = new graphql_1.GraphQLObjectType({
    name: "userType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
    }
});
