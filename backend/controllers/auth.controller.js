import { database } from "../plugins/config.js";
import { send_mail } from "../services/send.mail.js";
import logsService from "../services/logs.service.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { code_link } from "../utils/generator.js";

class AuthController {

    constructor(){
        this.users = database.collection('users')
        this.logs = database.collection('logs')
        this.code_mfa = database.collection('code_mfa')
    }
    
    async register(req, reply) {  
        try{
            
            const { email, password } = req.body;
        
            const salt = await bcrypt.genSalt(5)
            const password_hash = await bcrypt.hash(password, salt)

            const verify_email = await this.users.findOne({
                email: email.toLowerCase()
            })

            if ( verify_email ) {
                await logsService.createLogCreationCompte('error', email.toLowerCase(), 'admin', req.ip)
                return reply.send({
                    success: false,
                    message: "Votre adresse email est déjà utilisée",
                })
            }

            const result = await this.users.insertOne({
                email: email.toLowerCase(),
                password: password_hash,
                role: 'admin',
                isVerify: false,
                created_at: new Date()
            })

            // Send welcome email
            await send_mail.Welcome(email.toLowerCase(), result.insertedId);
            
            await logsService.createLogCreationCompte('attente', email.toLowerCase(), 'admin', req.ip)

            reply.send({
                success: true,
                data: result
            })

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }


    async resend_register(req, reply) {  
        try{
            
            const { email } = req.body;

            const get_user = await this.users.findOne({
                email: email.toLowerCase()
            })

            // Send welcome email
            await send_mail.Welcome(email.toLowerCase(), get_user._id);
            
            await logsService.createLogCreationCompte('attente', email.toLowerCase(), 'admin', req.ip)

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


    async confirmRegister(app, req, reply) {
        try {
            const { id } = req.params;
            
            const verify = await this.users.findOne({
                _id: new ObjectId(id)
            });
            
            if (!verify) {
                return reply.send({
                    success: false,
                    message: "Utilisateur non trouvé",
                });
            }
            
            const result = await this.users.updateOne(
                { _id: new ObjectId(id) },
                { $set: { isVerify: true } }
            );

            await logsService.createLogCreationCompte('success', verify.email, 'admin', req.ip)

            // Generate JWT token
            const token_access = app.jwt.sign(
                { id: id },
                { expiresIn: '1h' }
            )

            const token_refresh = app.jwt.sign(
                { id: id },
                { expiresIn: '7d' }
            )

            // redirection vers un site web
            reply.redirect('http://localhost:5173/confirm-account?access_token='+ token_access + '&refresh_token=' + token_refresh);
            // reply.redirect('https://mini-soc-unikin.vercel.app/confirm-account?access_token='+ token_access + '&refresh_token=' + token_refresh);

            reply.send({
                success: true,
                message: "Email confirmé avec succès"
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }





    async login(req, reply) {
        try {
            const { email, password } = req.body;
            
            const user = await this.users.findOne({
                email: email.toLowerCase()
            });

            if (!user) {
                await logsService.createLogConnexion('error', email.toLowerCase(), 'admin', req.ip)

                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }

            if (!user.isVerify) {
                await logsService.createLogConnexion('error', email.toLowerCase(), 'admin', req.ip)

                return reply.send({
                    success: false,
                    message: "Veuillez confirmer votre adresse email",
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                await logsService.createLogConnexion('error', email.toLowerCase(), 'admin', req.ip)
                
                return reply.send({
                    success: false,
                    message: "Adresse email ou mot de passe incorrect",
                })
            }


            const code = code_link();

            const result = await this.code_mfa.insertOne({
                email: email.toLowerCase(),
                code: code,
                verified: false,
                created_at: new Date()
            })

            await send_mail.MFA(email.toLowerCase(), code);

            await logsService.createLogConnexion('attente', email.toLowerCase(), 'admin', req.ip)
            
            reply.send({
                success: true,
                data: result.insertedId
            });

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }


    async confirmLogin(app, req, reply) {
        try {
            const { email, code } = req.body;
            
            const verify = await this.code_mfa.findOne({
                email: email.toLowerCase(),
                code: code,
                verified: false
            }, { sort: { created_at: -1 } });
            
            if (!verify) {
                return reply.send({
                    success: false,
                    message: "Code MFA invalide",
                });
            }
            
            const result = await this.code_mfa.updateOne(
                { _id: new ObjectId(verify._id) },
                { $set: { verified: true } }
            );

            await logsService.createLogCreationCompte('success', verify.email, 'admin', req.ip)

            // Generate JWT token
            const token_access = app.jwt.sign(
                { id: verify._id },
                { expiresIn: '2h' }
            )

            const token_refresh = app.jwt.sign(
                { id: verify._id },
                { expiresIn: '7d' }
            )

            reply.send({
                success: true,
                data: {
                    access_token: token_access,
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

    async resend_login(req, reply) {  
        try{
            
            const { email } = req.body;

            const code = code_link();

            const result = await this.code_mfa.insertOne({
                email: email.toLowerCase(),
                code: code,
                verified: false,
                created_at: new Date()
            })

            await send_mail.MFA(email.toLowerCase(), code);

            await logsService.createLogConnexion('attente', email.toLowerCase(), 'admin', req.ip)
            
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
                role: 'simulation',
                isVerify: true,
                created_at: new Date()
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