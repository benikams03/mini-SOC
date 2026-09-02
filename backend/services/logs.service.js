import { database } from "../plugins/config.js";

class LogsServices {

    constructor() {
        this.logs = database.collection('logs')
    }

    async createLogConnexion(type, user, role, ip) {
        if (type === 'success') {
            await this.logs.insertOne({
                type: 'success',
                action: role === 'admin' ? 'Connexion administrateur' : 'Connexion utilisateur',
                user: user,
                method: 'POST',
                route: '/login',
                adress_ip: ip,
                message: 'Connexion réussie',
                created_at: new Date()
            })
        } else if (type === 'error') {
            await this.logs.insertOne({
                type: 'error',
                action: role === 'admin' ? 'Connexion administrateur' : 'Connexion utilisateur',
                user: user,
                method: 'POST',
                route: '/login',
                adress_ip: ip,
                message: 'Connexion échouée, adresse email ou mot de passe incorrect',
                created_at: new Date()
            })
        }
    }
    
    async createLogCreationCompte(type, user, role, ip) {
        if (type === 'success') {
            await this.logs.insertOne({
                type: 'success',
                action: role === 'admin' ? 'Creation de compte administrateur' : 'Creation de compte utilisateur',
                user: user,
                method: 'POST',
                route: '/register',
                adress_ip: ip,
                message: 'Creation de compte réussie',
                created_at: new Date()
            })
        } else if (type === 'error') {
            await this.logs.insertOne({
                type: 'error',
                action: role === 'admin' ? 'Creation de compte administrateur' : 'Creation de compte utilisateur',
                user: user,
                method: 'POST',
                route: '/register',
                adress_ip: ip,
                message: 'Creation de compte échouée, Adresse email déjà utilisée',
                created_at: new Date()
            })
        }
    }

}

export default new LogsServices()