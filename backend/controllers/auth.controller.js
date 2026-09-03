import { database } from "../plugins/config.js";
import { send_mail } from "../services/send.mail.js";
import logsService from "../services/logs.service.js";
import bcrypt from "bcryptjs";

class AuthController {

    constructor(){
        this.users = database.collection('users')
        this.logs = database.collection('logs')
    }
    
    async register(app ,req, reply) {  
        try{
            
            const { email, password } = req.body;
        
            const salt = await bcrypt.genSalt(5)
            const password_hash = await bcrypt.hash(password, salt)

            const verify_email = await this.users.findOne({
                email: email.toLowerCase()
            })

            if ( verify_email ) {
                // await logsService.createLogCreationCompte('error', email.toLowerCase(), 'admin', req.ip)
                return reply.send({
                    success: false,
                    message: "Votre adresse email est déjà utilisée",
                })
            }

            const result = await this.users.insertOne({
                email: email.toLowerCase(),
                password: password_hash,
                role: 'admin'
            })


            // Generate JWT token
            const token_access = app.jwt.sign(
                { id: result.insertedId },
                { expiresIn: '1h' }
            )

            const token_refresh = app.jwt.sign(
                { id: result.insertedId },
                { expiresIn: '7d' }
            )


            // Send welcome email
            await send_mail.Welcome(email.toLowerCase());
            
            // await logsService.createLogCreationCompte('success', email.toLowerCase(), 'admin', req.ip)

            reply.send({
                success: true,
                data: {
                    token: token_access,
                    refresh_token: token_refresh
                }
            })

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }


    async login(app, req, reply) {
        try {
            const { email, password } = req.body;
            
            const user = await this.users.findOne({
                email: email.toLowerCase()
            });

            if (!user) {
                // await logsService.createLogConnexion('error', email.toLowerCase(), 'admin', req.ip)

                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                // await logsService.createLogConnexion('error', email.toLowerCase(), 'admin', req.ip)
                
                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }

            
            // Generate JWT token
            const token_access = app.jwt.sign(
                { id: user._id },
                { expiresIn: '1h' }
            )

            const token_refresh = app.jwt.sign(
                { id: user._id },
                { expiresIn: '7d' }
            )

            // await logsService.createLogConnexion('success', email.toLowerCase(), 'admin', req.ip)
            
            reply.send({
                success: true,
                data: {
                    token: token_access,
                    refresh_token: token_refresh
                }
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

    // async confirmEmail(app, req, reply) {
    //     try {
    //         const { email } = req.params;
            
    //         const result = await this.users.updateOne(
    //             { email: email.toLowerCase() },
    //             { $set: { confirmed: true } }
    //         );

    //         reply.send({
    //             success: true,
    //             message: "Email confirmé avec succès"
    //         });
    //     } catch (error) {
    //         reply.send({
    //             success: false,
    //             message: error.message,
    //         })
    //     }
    // }





    // connexion et creation de compte du coter de la partie simulation
    async registerSimulation(req, reply) {  
        try{
            
            const { email, password } = req.body;
        
            const salt = await bcrypt.genSalt(5)
            const password_hash = await bcrypt.hash(password, salt)

            const verify_email = await this.users.findOne({
                email: email.toLowerCase()
            })

            if ( verify_email ) {
                await logsService.createLogCreationCompte('error', email.toLowerCase(), 'simulation', req.ip)
                return reply.send({
                    success: false,
                    message: "Votre adresse email est déjà utilisée",
                })
            }

            const result = await this.users.insertOne({
                email: email.toLowerCase(),
                password: password_hash,
                role: 'simulation'
            })
            
            await logsService.createLogCreationCompte('success', email.toLowerCase(), 'simulation', req.ip)

            reply.send({
                success: true
            })

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

    async loginSimulation( req, reply) {
        try {
            const { email, password } = req.body;
            
            const user = await this.users.findOne({
                email: email.toLowerCase(),
                role: 'simulation'
            });

            if (!user) {
                await logsService.createLogConnexion('error', email.toLowerCase(), 'simulation', req.ip)

                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                await logsService.createLogConnexion('error', email.toLowerCase(), 'simulation', req.ip)
                
                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }

            await logsService.createLogConnexion('success', email.toLowerCase(), 'simulation', req.ip)
            
            reply.send({
                success: true
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

}

export default new AuthController();