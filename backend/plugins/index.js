import fp from "fastify-plugin";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { UAParser } from "ua-parser-js";

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
            reply.send({ 
                success: false,
                token_invalid: true,
                message: "Token expired or invalid" 
            })
        }
    })

    // Helmet for security headers, helps for the attack prevention
    app.register(helmet);

    // Rate limiting to prevent abuse, based on IP address
    app.register(fastifyRateLimit, {
        max: 50,
        timeWindow: '1 minute',
    });

    // pour recuperer les informations de l'utilisateurs
    app.decorateRequest('client', null)

    app.addHook('onRequest', async (request) => {
        const ua = new UAParser(request.headers['user-agent']).getResult()

        request.client = {
            ip: request.ip,

            browser: {
                name: ua.browser.name,
                version: ua.browser.version,
            },

            os: {
                name: ua.os.name,
                version: ua.os.version,
            },

            device: {
                type: ua.device.type ?? 'desktop',
                model: ua.device.model,
                vendor: ua.device.vendor,
            },

            userAgent: request.headers['user-agent'],
        }
    })
    
});