import fp from "fastify-plugin";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { UAParser } from "ua-parser-js";
import alertsService from "../services/alerts.service.js";

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
        sign: {
            expiresIn: '1h'
        }
    })
    
    // Decorate the request with authenticate method
    app.decorate("authenticate", async (request, reply) => {
        try{
            await request.jwtVerify();
        } catch (err) {
            console.log('JWT Error Details:', {
                code: err.code,
                message: err.message,
                name: err.name,
                stack: err.stack
            });
            
            // Distinguer entre token expiré et token invalide
            const isExpired = err.code === 'FAST_JWT_EXPIRED' || 
                            err.message.includes('expired') ||
                            err.name === 'TokenExpiredError';
            
            alertsService.createAlertUnauthorizedAccess(request.client, isExpired)
            
            return reply.code(401).send({ 
                success: false,
                token_invalid: true,
                token_expired: isExpired,
                message: isExpired ? "Token expired" : "Token invalid",
                debug: {
                    code: err.code,
                    message: err.message,
                    name: err.name
                }
            })
        }
    })

    // Helmet for security headers, helps for the attack prevention
    app.register(helmet);

    // Rate limiting to prevent abuse, based on IP address
    app.register(fastifyRateLimit, {
        max: 15,
        timeWindow: '1 minute',

         errorResponseBuilder: (request, context) => {
            const user_agent = request.client 
            alertsService.createAlertDDOS(user_agent)

            return {
                success: false,
                message: 'Trop de requêtes. Réessayez dans une minute.',
            };
        },
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