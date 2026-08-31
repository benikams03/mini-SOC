import authController from "../controllers/auth.controller.js"

export default function authRoutes (app) {

    app.post('/register', (req, reply) => authController.register(app, req, reply) )
    app.post('/login', (req, reply) => authController.login(app, req, reply) )


}