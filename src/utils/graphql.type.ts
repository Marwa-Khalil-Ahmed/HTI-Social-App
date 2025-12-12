import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const userType = new GraphQLObjectType({
  name: "userData",
  fields: {
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  },
});
