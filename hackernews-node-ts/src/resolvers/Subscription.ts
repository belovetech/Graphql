import { GraphQLContext } from '../context';
import { pubSubChannels } from '../pubsub';

const newLink = {
  subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.pubsub.asyncIterator('newLink');
  },

  resolve: (payload: pubSubChannels['newLink'][0]) => {
    return payload.createdLink;
  },
};

const newVote = {
  subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
    return context.pubsub.asyncIterator('newVote');
  },

  resolve: (payload: pubSubChannels['newVote'][0]) => {
    return payload.createdVote;
  },
};

export { newLink, newVote };
