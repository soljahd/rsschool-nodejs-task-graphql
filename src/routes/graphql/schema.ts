import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { getQueries } from './resolver/queries.js';
import { getMutations } from './resolver/mutations.js';

export interface GQLContext {
  prisma: PrismaClient;
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: getQueries,
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: getMutations,
});

export const createSchema = (prisma: PrismaClient) => {
  return {
    schema: new GraphQLSchema({
      query: RootQuery,
      mutation: RootMutation,
    }),
    contextValue: { prisma } as GQLContext,
  };
};
