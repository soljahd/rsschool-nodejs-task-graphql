import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import type { PrismaClient } from '@prisma/client';

export interface GQLContext {
  prisma: PrismaClient;
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    testString: {
      type: GraphQLString,
      resolve: () => 'Test string',
    },
  },
});

export const createSchema = (prisma: PrismaClient) => {
  return {
    schema: new GraphQLSchema({
      query: RootQuery,
    }),
    contextValue: { prisma } as GQLContext,
  };
};
