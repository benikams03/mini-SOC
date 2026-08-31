import fp from "fastify-plugin";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
// import helmet from "@fastify/helmet";

dotenv.config();

export default fp( (app) => {

    // CORS for cross-origin requests
    app.register(fastifyCors, {
        origin: true,
        credentials: true,
    });
    
    // Form body parsing
    app.register(fastifyFormbody);

    // JWT authentication
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET,
    })
    
    // Decorate the request with authenticate method
    app.decorate("authenticate", async (request, reply) => {
        try{
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ 
                succes: false,
                message: "Token expired or invalid" 
            })
        }
    })

    // Helmet for security headers, helps for the attack prevention
    // app.register(helmet);

    // Rate limiting to prevent abuse, based on IP address
    app.register(fastifyRateLimit, {
        max: 50,
        timeWindow: '1 minute',
    });
    
});