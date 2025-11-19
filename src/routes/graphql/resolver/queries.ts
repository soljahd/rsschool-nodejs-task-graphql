import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLList } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { UserType } from '../types/user.js';
import { PostType } from '../types/post.js';
import { ProfileType } from '../types/profile.js';
import { MemberTypeType, MemberTypeEnum } from '../types/memberType.js';
import { UUIDType } from '../types/uuid.js';
import type { GQLContext } from '../schema.js';

export const getQueries = (): GraphQLFieldConfigMap<unknown, GQLContext> => ({
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (_source, _args, context: GQLContext, resolveInfo) => {
      const parsed = parseResolveInfo(resolveInfo);

      if (!parsed || typeof parsed !== 'object' || !('fieldsByTypeName' in parsed)) {
        const users = await context.prisma.user.findMany();
        users.forEach((user) => context.loaders.user.prime(user.id, user));
        return users;
      }

      const simplified = simplifyParsedResolveInfoFragmentWithType(
        parsed as ResolveTree,
        resolveInfo.returnType,
      );

      const fields = simplified.fields;

      const needsUserSubscribedTo = 'userSubscribedTo' in fields;
      const needsSubscribedToUser = 'subscribedToUser' in fields;

      const include: Record<string, true> = {};

      if (needsUserSubscribedTo) {
        include.userSubscribedTo = true;
      }

      if (needsSubscribedToUser) {
        include.subscribedToUser = true;
      }

      const users = await context.prisma.user.findMany({
        include: Object.keys(include).length > 0 ? include : undefined,
      });

      users.forEach((user) => {
        context.loaders.user.prime(user.id, user);

        if (needsUserSubscribedTo) {
          context.loaders.userSubscribedTo.prime(user.id, []);
        }

        if (needsSubscribedToUser) {
          context.loaders.subscribedToUser.prime(user.id, []);
        }
      });

      return users;
    },
  },
  user: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) =>
      context.loaders.user.load(args.id),
  },
  posts: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    resolve: async (_source, _args, context: GQLContext) => {
      const posts = await context.prisma.post.findMany();

      posts.forEach((post) => {
        context.loaders.post.prime(post.id, post);
      });

      return posts;
    },
  },
  post: {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) =>
      context.loaders.post.load(args.id),
  },
  profiles: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    resolve: async (_source, _args, context: GQLContext) => {
      const profiles = await context.prisma.profile.findMany();

      profiles.forEach((profile) => {
        context.loaders.profile.prime(profile.id, profile);
      });

      return profiles;
    },
  },
  profile: {
    type: ProfileType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) =>
      context.loaders.profile.load(args.id),
  },
  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
    resolve: async (_source, _args, context: GQLContext) => {
      const memberTypes = await context.prisma.memberType.findMany();

      memberTypes.forEach((type) => {
        context.loaders.memberType.prime(type.id, type);
      });

      return memberTypes;
    },
  },
  memberType: {
    type: MemberTypeType,
    args: { id: { type: new GraphQLNonNull(MemberTypeEnum) } },
    resolve: async (_source, args: { id: string }, context: GQLContext) =>
      context.loaders.memberType.load(args.id),
  },
});
