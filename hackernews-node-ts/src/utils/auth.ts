import { PrismaClient, User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';

const APP_SECRET = process.env.APP_SECRET ?? 'appsecret321';

function getTokenPayload(token: string): any {
  return jwt.verify(token, APP_SECRET);
}

function authenticateUser(
  prisma: PrismaClient,
  req: FastifyRequest
): Promise<User | null> {
  const Authorization = req.headers?.authorization;
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = getTokenPayload(token);
    return prisma.user.findUnique({ where: { id: userId } });
  }
  return Promise.resolve(null);
}

export { authenticateUser, APP_SECRET };
