import { Link } from '@prisma/client';
import { GraphQLContext } from '../context';

async function postedBy(parent: Link, args: {}, context: GraphQLContext) {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .postedBy();
}

async function votes(parent: Link, args: {}, context: GraphQLContext) {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
}

export { postedBy, votes };
