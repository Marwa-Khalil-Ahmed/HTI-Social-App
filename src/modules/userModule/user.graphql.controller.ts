import { GraphQLList, GraphQLString } from "graphql";
import { userType } from "./user.types";
import { hello, me } from "./user.graphql.services";

export const userQuery = {
  hello: {
    type: GraphQLString,
    args: {
      name: { type: GraphQLString },
    },
    resolve: hello,
  },
  me: {
    type: userType,
    resolve: me,
  },
};

export const userMutation = {
  hello: {
    type: GraphQLString,
    resolve: () => {
      return "hello";
    },
  },
};
