import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createSchema } from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const document = parse(query);
      const { schema, contextValue } = createSchema(prisma);
      const errors = validate(schema, document, [depthLimit(5)]);
      if (errors.length) return { data: null, errors };

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue,
      });

      return result;
    },
  });
};

export default plugin;
