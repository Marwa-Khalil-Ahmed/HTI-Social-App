import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { userType } from "../../utils/graphql.type";
import { userMutation, userQuery } from "../userModule/user.graphql.controller";


export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainQuery",
    fields: {
      ...userQuery
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mainQuery",
    fields: {
      ...userMutation
    },
  }),
});
