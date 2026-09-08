import { database } from "../plugins/config.js";

class LogsServices {

    constructor() {
        this.logs = database.collection('logs')
    }

    // Fonction helper pour gérer la déduplication avec count
    async createOrUpdateLog(logData, ip, route) {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        
        // Chercher un log similaire dans les 2 dernières minutes
        const existingLog = await this.logs.findOne({
            adress_ip: ip,
            route: route,
            created_at: { $gte: twoMinutesAgo }
        }, { sort: { created_at: -1 } });

        if (existingLog) {
            // Mettre à jour le log existant en incrémentant le count
            await this.logs.updateOne(
                { _id: existingLog._id },
                { 
                    $inc: { count: 1 },
                    $set: { created_at: new Date() }
                }
            );
        } else {
            // Créer un nouveau log avec count = 1
            await this.logs.insertOne({
                ...logData,
                count: 1,
                created_at: new Date()
            });
        }
    }

    async createLogConnexion(type, user, role, ip) {
        const route = role === 'admin' ? '/login' : '/login-simulation';
        
        if (type === 'success') {
            await this.logs.insertOne({
                type: 'success',
                action: role === 'admin' ? 'Connexion administrateur' : 'Connexion utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'Connexion réussie',
                created_at: new Date()
            });
        } else if (type === 'error') {
            await this.logs.insertOne({
                type: 'error',
                action: role === 'admin' ? 'Connexion administrateur' : 'Connexion utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'Connexion échouée, adresse email ou mot de passe incorrect',
                created_at: new Date()
            });
        } else if (type === 'attente') {
            await this.logs.insertOne({
                type: 'attente',
                action: role === 'admin' ? 'Connexion administrateur' : 'Connexion utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'En attente de confirmation du code mfa',
                created_at: new Date()
            });
        }
    }
    
    async createLogCreationCompte(type, user, role, ip) {
        const route = role === 'admin' ? '/register' : '/register-simulation';
        
        if (type === 'success') {
            await this.logs.insertOne({
                type: 'success',
                action: role === 'admin' ? 'Creation de compte administrateur' : 'Creation de compte utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'Creation de compte réussie',
                created_at: new Date()
            });
        } else if (type === 'error') {
            await this.logs.insertOne({
                type: 'error',
                action: role === 'admin' ? 'Creation de compte administrateur' : 'Creation de compte utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'Creation de compte échouée, Adresse email déjà utilisée',
                created_at: new Date()
            });
        } else if (type === 'attente') {
            await this.logs.insertOne({
                type: 'attente',
                action: role === 'admin' ? 'Creation de compte administrateur' : 'Creation de compte utilisateur',
                user: user,
                method: 'POST',
                route: route,
                adress_ip: ip,
                message: 'Creation de compte en attente de confirmation',
                created_at: new Date()
            });
        }
    }

    async createLogDataRetrieval(type, dataType, ip) {
        const route = dataType === 'logs' ? '/logs' : dataType === 'alerts' ? '/alerts' : '/users';
        
        if (type === 'success') {
            await this.createOrUpdateLog({
                type: 'success',
                action: `Récupération des données - ${dataType}`,
                user: 'admin',
                method: 'GET',
                route: route,
                adress_ip: ip,
                message: `Récupération des ${dataType} réussie`
            }, ip, route);
        } else if (type === 'error') {
            await this.createOrUpdateLog({
                type: 'error',
                action: `Récupération des données - ${dataType}`,
                user: 'admin',
                method: 'GET',
                route: route,
                adress_ip: ip,
                message: `Récupération des ${dataType} échouée`
            }, ip, route);
        }
    }

}

export default new LogsServices()