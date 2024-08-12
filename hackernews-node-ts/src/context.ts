import { PrismaClient, User } from '@prisma/client';
import { authenticateUser } from './utils/auth';
import { FastifyRequest } from 'fastify';
import { pubsub } from './pubsub';

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: User | null;
  pubsub: typeof pubsub;
};

export async function contextFactory(
  req: FastifyRequest
): Promise<GraphQLContext> {
  return { prisma, currentUser: await authenticateUser(prisma, req), pubsub };
}
