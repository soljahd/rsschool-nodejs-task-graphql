import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { getQueries } from './resolver/queries.js';
import { getMutations } from './resolver/mutations.js';
import { createLoaders, type Loaders } from './loaders.js';

export interface GQLContext {
  prisma: PrismaClient;
  loaders: Loaders;
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
  const loaders = createLoaders(prisma);

  return {
    schema: new GraphQLSchema({
      query: RootQuery,
      mutation: RootMutation,
    }),
    contextValue: { prisma, loaders } as GQLContext,
  };
};
