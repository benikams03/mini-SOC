import authController from "../controllers/auth.controller.js"
import logsController from "../controllers/logs.controller.js"

export default function authRoutes (app) {

    app.post('/register', (req, reply) => authController.register(app, req, reply) )
    app.post('/login', (req, reply) => authController.login(app, req, reply) )

    app.post('/register-simulation', (req, reply) => authController.registerSimulation(req, reply) )
    app.post('/login-simulation', (req, reply) => authController.loginSimulation(req, reply) )

    app.get('/logs', (req, reply) => logsController.get(req, reply) )


}