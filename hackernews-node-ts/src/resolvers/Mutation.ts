import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { GraphQLContext } from '../context';
import { Link, User, Vote } from '@prisma/client';
import { APP_SECRET } from '../utils/auth';

async function signup(
  parent: unknown,
  args: Omit<User, 'id'>,
  context: GraphQLContext
): Promise<{ token: string; user: User }> {
  try {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
      data: { ...args, password },
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return { token, user };
  } catch (error) {
    const isUniqueConstraintError =
      error instanceof Error &&
      error.message.includes(
        'Unique constraint failed on the fields: (`email`)'
      );
    if (isUniqueConstraintError) {
      throw new Error('User already exists');
    } else {
      throw new Error('Something went wrong');
    }
  }
}

async function login(
  parent: unknown,
  args: User,
  context: GraphQLContext
): Promise<{ token: string; user: User }> {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function post(
  parent: unknown,
  args: { url: string; description: string },
  context: GraphQLContext
): Promise<Link> {
  const { currentUser } = context;
  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: { connect: { id: currentUser.id } },
    },
  });

  context.pubsub.publish('newLink', { createdLink: newLink });

  return newLink;
}

async function updateLink(
  parent: unknown,
  args: { id: number; url: string; description: string },
  context: GraphQLContext
): Promise<Link> {
  const updatedLink = await context.prisma.link.update({
    where: { id: +args.id },
    data: {
      description: args.description,
      url: args.url,
    },
  });
  return updatedLink;
}

async function vote(
  parent: unknown,
  args: { linkId: number },
  context: GraphQLContext
): Promise<Vote> {
  const { currentUser } = context;
  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: currentUser.id,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: currentUser.id } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  context.pubsub.publish('newVote', { createdVote: newVote });

  return newVote;
}

export { signup, login, post, vote, updateLink };
