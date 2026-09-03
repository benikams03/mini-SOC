import fastify from 'fastify';
import pluginsConfig from './plugins/index.js';
import authRoutes from './routes/index.js';

const app = fastify({
    logger: true,
    trustProxy: true
});

app.register(pluginsConfig);

app.register(authRoutes, { prefix: '/api/v1' });

// Health check endpoint
app.get('/', async (request, reply) => {
    return { test_connection: 'success' };
});

(async () => {
    try {
        await app.listen({ port: 5050, host: '0.0.0.0' });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();