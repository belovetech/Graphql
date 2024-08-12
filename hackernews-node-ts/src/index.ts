import 'graphql-import-node';
import fastify from 'fastify';
import {
  getGraphQLParameters,
  processRequest,
  Request,
  sendResult,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { schema } from './schema';
import { contextFactory } from './context';

async function main() {
  const server = fastify({
    logger: true,
  });

  server.get('/health', async () => {
    return { status: 'ok' };
  });

  server.route({
    method: ['POST', 'GET'],
    url: '/graphql',
    handler: async (req, reply) => {
      const request: Request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      if (shouldRenderGraphiQL(request)) {
        return reply.type('text/html').send(renderGraphiQL());
      }

      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => contextFactory(req),
      });

      sendResult(result, reply.raw);
    },
  });

  server.listen({ port: 4000, host: '0.0.0.0' }, () => {
    console.log('Server is running on http://localhost:4000');
  });
}

main().catch((error) => {
  console.error(error);
});
