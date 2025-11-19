import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { getQueries } from './resolver/queries.js';

export interface GQLContext {
  prisma: PrismaClient;
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: getQueries,
});

export const createSchema = (prisma: PrismaClient) => {
  return {
    schema: new GraphQLSchema({
      query: RootQuery,
    }),
    contextValue: { prisma } as GQLContext,
  };
};
