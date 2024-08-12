import { Vote } from '@prisma/client';
import { GraphQLContext } from '../context';

async function user(parent: Vote, args: {}, context: GraphQLContext) {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).user();
}

async function link(parent: Vote, args: {}, context: GraphQLContext) {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).link();
}

export { user, link };
