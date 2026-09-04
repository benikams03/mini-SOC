import authController from "../controllers/auth.controller.js"
import logsController from "../controllers/logs.controller.js"
import alertsService from "../services/alerts.service.js"

export default function authRoutes (app) {

    app.post('/register', (req, reply) => authController.register(app, req, reply) )
    app.get('/confirm-register/:id', (req, reply) => authController.confirmRegister(app, req, reply) )
    app.post('/login',{
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute',
                errorResponseBuilder: (request, context) => {
                    const user_agent = request.client 
                    alertsService.createAlertLogin('admin', user_agent)

                    return {
                        success: false,
                        message: 'Trop de requêtes. Réessayez dans une minute.',
                    };
                },
            },
        },
    }, (req, reply) => authController.login(app, req, reply) )

    app.post('/register-simulation', (req, reply) => authController.registerSimulation(req, reply) )
    app.post('/login-simulation',{
        config: {
            rateLimit: {
                max: 2,
                timeWindow: '1 minute',
                errorResponseBuilder: (request, context) => {
                    const user_agent = request.client 
                    alertsService.createAlertLogin('user', user_agent)

                    return {
                        success: false,
                        message: 'Trop de requêtes. Réessayez dans une minute.',
                    };
                },
            },
        },
    }, (req, reply) => authController.loginSimulation(req, reply) )

    app.get('/logs', (req, reply) => logsController.get(req, reply) )


}