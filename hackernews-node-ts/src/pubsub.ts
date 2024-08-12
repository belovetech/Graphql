import { Link, Vote } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { TypedPubSub } from 'typed-graphql-subscriptions';

export type pubSubChannels = {
  newLink: [{ createdLink: Link }];
  newVote: [{ createdVote: Vote }];
};

export const pubsub = new TypedPubSub<pubSubChannels>(new PubSub());
