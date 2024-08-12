import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema.graphql';
import * as Query from './resolvers/Query';
import * as Mutation from './resolvers/Mutation';
import * as Link from './resolvers/Link';
import * as User from './resolvers/User';
import * as Vote from './resolvers/Vote';
import * as Subscription from './resolvers/Subscription';

const resolvers = {
  Query,
  Mutation,
  Link,
  User,
  Vote,
  Subscription,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
