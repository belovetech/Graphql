import { Link, Prisma, User } from '@prisma/client';
import { GraphQLContext } from '../context';

async function info(
  parent: unknown,
  args: { id: string },
  context: GraphQLContext
): Promise<Link | null> {
  return context.prisma.link.findFirst({
    where: { id: +args.id },
  });
}

async function feed(
  parent: unknown,
  args: {
    filter?: string;
    skip?: number;
    take?: number;
    orderBy: {
      description: Prisma.SortOrder;
      url: Prisma.SortOrder;
      createdAt: Prisma.SortOrder;
    };
  },
  context: GraphQLContext
): Promise<{ links: Link[]; count: number }> {
  const { filter } = args;
  const where = {
    OR: [
      { description: { contains: filter ?? '' } },
      { url: { contains: filter ?? '' } },
    ],
  };
  const count = await context.prisma.link.count({ where });
  const links = await context.prisma.link.findMany({
    where: where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });
  return { links, count };
}

async function me(
  parent: unknown,
  args: {},
  context: GraphQLContext
): Promise<User> {
  const { currentUser } = context;
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  return currentUser;
}

async function users(
  parent: unknown,
  args: {},
  context: GraphQLContext
): Promise<User[]> {
  return context.prisma.user.findMany();
}

async function user(
  parent: unknown,
  args: { id: string },
  context: GraphQLContext
): Promise<User | null> {
  return context.prisma.user.findUnique({
    where: { id: args.id },
  });
}

export { info, feed, me, users, user };
