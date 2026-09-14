import authController from "../controllers/auth.controller.js"
import logsController from "../controllers/logs.controller.js"
import userController from "../controllers/user.controller.js"
import alertController from "../controllers/alert.controller.js"
import dashboardController from "../controllers/dashboard.controller.js"
import alertsService from "../services/alerts.service.js"

const alertClients = new Set();

export default function authRoutes (app) {
    // Initialiser les clients WebSocket dans le service
    alertsService.setAlertClients(alertClients)

    app.post('/register', (req, reply) => authController.register( req, reply) )

    app.post('/resend-register',{
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
    }, (req, reply) => authController.resend_register( req, reply) )
    
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
    }, (req, reply) => authController.login( req, reply) )
    
    app.post('/confirm-login', (req, reply) => authController.confirmLogin(app, req, reply) )

    app.post('/resend-login', (req, reply) => authController.resend_login(req, reply) )





    app.post('/register-simulation', (req, reply) => authController.registerSimulation(req, reply) )

    app.post('/login-simulation',{
        config: {
            rateLimit: {
                max: 5,
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


    

    app.get('/logs',{
        preHandler: [app.authenticate]
    } ,(req, reply) => logsController.get(req, reply) )

    app.get('/users',{
        preHandler: [app.authenticate]
    } ,(req, reply) => userController.getUsers(req, reply) )

    app.get('/alerts',{
        preHandler: [app.authenticate]
    } ,(req, reply) => alertController.getAlerts(req, reply) )

    // Route WebSocket pour les alertes en temps réel
    app.get('/alerts-live', {
        websocket: true,
        preHandler: async (request, reply) => {
            try {
                // Essayer d'abord le header Authorization
                await request.jwtVerify();
            } catch (err) {
                // Si échec, essayer le token dans query string
                const token = request.query.token;
                if (token) {
                    request.headers.authorization = `Bearer ${token}`;
                    await request.jwtVerify();
                } else {
                    throw err;
                }
            }
        }
    }, (connection, req) => {
        // Ajouter le client à la liste des clients connectés
        alertClients.add(connection)

        // Envoyer un message de confirmation
        connection.send(JSON.stringify({
            type: 'connected',
            message: 'Connecté au flux d\'alertes en temps réel'
        }))

        // Gérer la déconnexion
        connection.on('close', () => {
            alertClients.delete(connection)
        })

        // Gérer les erreurs
        connection.on('error', (error) => {
            console.error('WebSocket error:', error)
            alertClients.delete(connection)
        })
    })

    app.get('/dashboard',{
        preHandler: [app.authenticate]
    } ,(req, reply) => dashboardController.getDashboard(req, reply) )


    // route for test
    app.get('/test',{ preHandler: [app.authenticate] }, (req, reply)=>{ reply.send({ success: true }) })
    app.get('/token-temp', (req, reply)=>{ 
        
        const token_access = app.jwt.sign(
                { id: 'test' },
                { expiresIn: '60s' }
            )
        reply.send({ success: true, token: token_access }) 
    
    })

}