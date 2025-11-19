import DataLoader from 'dataloader';
import type { Post, PrismaClient, User, Profile, MemberType } from '@prisma/client';

export const createLoaders = (prisma: PrismaClient) => {
  const userLoader = new DataLoader<string, User | null>(
    async (ids: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: [...ids] } },
      });

      const userMap = new Map(users.map((user) => [user.id, user]));
      return ids.map((id) => userMap.get(id) || null);
    },
  );

  const memberTypeLoader = new DataLoader<string, MemberType | null>(
    async (ids: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: [...ids] } },
      });

      const memberTypeMap = new Map(memberTypes.map((type) => [type.id, type]));
      return ids.map((id) => memberTypeMap.get(id) || null);
    },
  );

  const postsByAuthorLoader = new DataLoader<string, Post[]>(
    async (authorIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
      });

      const postsByAuthor = new Map<string, Post[]>();
      authorIds.forEach((id) => postsByAuthor.set(id, []));
      posts.forEach((post) => {
        const authorPosts = postsByAuthor.get(post.authorId) || [];
        authorPosts.push(post);
        postsByAuthor.set(post.authorId, authorPosts);
      });

      return authorIds.map((authorId) => postsByAuthor.get(authorId) || []);
    },
  );

  const profileByUserIdLoader = new DataLoader<string, Profile | null>(
    async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...userIds] } },
      });

      const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
      return userIds.map((userId) => profileMap.get(userId) || null);
    },
  );

  const userSubscribedToLoader = new DataLoader<string, User[]>(
    async (userIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: [...userIds] } },
        include: { author: true },
      });

      subscriptions.forEach((sub) => {
        userLoader.prime(sub.author.id, sub.author);
      });

      const subscriptionsByUser = new Map<string, User[]>();
      userIds.forEach((id) => subscriptionsByUser.set(id, []));
      subscriptions.forEach((sub) => {
        const userSubscriptions = subscriptionsByUser.get(sub.subscriberId) || [];
        userSubscriptions.push(sub.author);
        subscriptionsByUser.set(sub.subscriberId, userSubscriptions);
      });

      return userIds.map((userId) => subscriptionsByUser.get(userId) || []);
    },
  );

  const subscribedToUserLoader = new DataLoader<string, User[]>(
    async (userIds: readonly string[]) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: [...userIds] } },
        include: { subscriber: true },
      });

      subscribers.forEach((sub) => {
        userLoader.prime(sub.subscriber.id, sub.subscriber);
      });

      const subscribersByUser = new Map<string, User[]>();
      userIds.forEach((id) => subscribersByUser.set(id, []));
      subscribers.forEach((sub) => {
        const userSubscribers = subscribersByUser.get(sub.authorId) || [];
        userSubscribers.push(sub.subscriber);
        subscribersByUser.set(sub.authorId, userSubscribers);
      });

      return userIds.map((userId) => subscribersByUser.get(userId) || []);
    },
  );

  return {
    user: userLoader,
    memberType: memberTypeLoader,
    postsByAuthor: postsByAuthorLoader,
    profileByUserId: profileByUserIdLoader,
    userSubscribedTo: userSubscribedToLoader,
    subscribedToUser: subscribedToUserLoader,
  };
};

export type Loaders = ReturnType<typeof createLoaders>;
