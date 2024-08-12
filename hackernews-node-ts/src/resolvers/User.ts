import { User } from '@prisma/client';
import { GraphQLContext } from '../context';

async function links(parent: User, args: {}, context: GraphQLContext) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links();
}

export { links };
