import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLList } from 'graphql';
import { UserType } from '../types/user.js';
import { PostType } from '../types/post.js';
import { ProfileType } from '../types/profile.js';
import { MemberTypeType, MemberTypeEnum } from '../types/memberType.js';
import { UUIDType } from '../types/uuid.js';
import type { GQLContext } from '../schema.js';

export const getQueries = (): GraphQLFieldConfigMap<unknown, GQLContext> => ({
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (_source, _args, context: GQLContext) => {
      return context.prisma.user.findMany();
    },
  },
  user: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) => {
      return context.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },
  posts: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    resolve: async (_source, _args, context: GQLContext) => {
      return context.prisma.post.findMany();
    },
  },
  post: {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) => {
      return context.prisma.post.findUnique({
        where: { id: args.id },
      });
    },
  },
  profiles: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    resolve: async (_source, _args, context: GQLContext) => {
      return context.prisma.profile.findMany();
    },
  },
  profile: {
    type: ProfileType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) => {
      return context.prisma.profile.findUnique({
        where: { id: args.id },
      });
    },
  },
  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
    resolve: async (_source, _args, context: GQLContext) => {
      return context.prisma.memberType.findMany();
    },
  },
  memberType: {
    type: MemberTypeType,
    args: { id: { type: new GraphQLNonNull(MemberTypeEnum) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) => {
      return context.prisma.memberType.findUnique({
        where: { id: args.id },
      });
    },
  },
});
