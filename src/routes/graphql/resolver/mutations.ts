import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from '../types/user.js';
import { PostType } from '../types/post.js';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';
import type { GQLContext } from '../schema.js';
import type { User, Post, Profile } from '@prisma/client';

import {
  CreateUserInput,
  ChangeUserInput,
  CreatePostInput,
  ChangePostInput,
  CreateProfileInput,
  ChangeProfileInput,
} from '../types/inputs.js';

export const getMutations = (): GraphQLFieldConfigMap<unknown, GQLContext> => ({
  createUser: {
    type: UserType,
    args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
    resolve: async (_source, args: { dto: Pick<User, 'name' | 'balance'> }, context) =>
      context.prisma.user.create({ data: args.dto }),
  },
  changeUser: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInput) },
    },
    resolve: async (
      _source,
      args: { id: string; dto: Partial<Pick<User, 'name' | 'balance'>> },
      context,
    ) => context.prisma.user.update({ where: { id: args.id }, data: args.dto }),
  },
  deleteUser: {
    type: GraphQLString,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context) => {
      await context.prisma.user.delete({ where: { id: args.id } });
      return 'ok';
    },
  },

  createPost: {
    type: PostType,
    args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
    resolve: async (
      _source,
      args: { dto: Pick<Post, 'title' | 'content' | 'authorId'> },
      context,
    ) => context.prisma.post.create({ data: args.dto }),
  },
  changePost: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInput) },
    },
    resolve: async (
      _source,
      args: { id: string; dto: Partial<Pick<Post, 'title' | 'content'>> },
      context,
    ) => context.prisma.post.update({ where: { id: args.id }, data: args.dto }),
  },
  deletePost: {
    type: GraphQLString,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context) => {
      await context.prisma.post.delete({ where: { id: args.id } });
      return 'ok';
    },
  },

  createProfile: {
    type: ProfileType,
    args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
    resolve: async (
      _source,
      args: { dto: Pick<Profile, 'isMale' | 'yearOfBirth' | 'userId' | 'memberTypeId'> },
      context,
    ) => context.prisma.profile.create({ data: args.dto }),
  },
  changeProfile: {
    type: ProfileType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeProfileInput) },
    },
    resolve: async (
      _source,
      args: {
        id: string;
        dto: Partial<Pick<Profile, 'isMale' | 'yearOfBirth' | 'memberTypeId'>>;
      },
      context,
    ) => context.prisma.profile.update({ where: { id: args.id }, data: args.dto }),
  },
  deleteProfile: {
    type: GraphQLString,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context) => {
      await context.prisma.profile.delete({ where: { id: args.id } });
      return 'ok';
    },
  },

  subscribeTo: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_source, args: { userId: string; authorId: string }, context) => {
      await context.prisma.subscribersOnAuthors.create({
        data: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      });
      return 'ok';
    },
  },
  unsubscribeFrom: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_source, args: { userId: string; authorId: string }, context) => {
      await context.prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId },
        },
      });
      return 'ok';
    },
  },
});
