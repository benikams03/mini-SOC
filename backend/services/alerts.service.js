import { database } from "../plugins/config.js";

class AlertsServices {

    constructor() {
        this.alerts = database.collection('alerts')
    }
    
    async createAlertLogin(role, user_agent) {
        const ip = user_agent.ip || 'Unknown';
        
        const existingAlert = await this.alerts.findOne(
            { 'user_agent.ip': ip },
            { sort: { created_at: -1 } }
        );
        
        if (!existingAlert) {

            await this.alerts.insertOne({
                ruleID: 'IDS-001',
                title: 'Brute Force Login',
                category: role === 'admin' ? 'Authentication administrateur' : 'Authentication user',
                severity:'CRITIQUE',
                user: 'null',
                user_agent : user_agent,
                action: 'IP bloquée temporairement',
                created_at: new Date()

            });
        } else {

            const lastCreated = new Date(existingAlert.created_at);
            const now = new Date();
            const timeDiff = now - lastCreated;
            const oneMinute = 60 * 1000;
            
            if (timeDiff >= oneMinute) {

                await this.alerts.insertOne({
                    ruleID: 'IDS-001',
                    title: 'Brute Force Login',
                    category: role === 'admin' ? 'Authentication administrateur' : 'Authentication user',
                    severity:'CRITIQUE',
                    user: 'null',
                    user_agent : user_agent,
                    action: 'IP bloquée temporairement',
                    created_at: new Date()
                });
            }

        }
    }

    async createAlertDDOS(user_agent) {
        const ip = user_agent.ip || 'Unknown';
        
        const existingAlert = await this.alerts.findOne(
            { 'user_agent.ip': ip, ruleID: 'IDS-002' },
            { sort: { created_at: -1 } }
        );
        
        if (!existingAlert) {
            await this.alerts.insertOne({
                ruleID: 'IDS-002',
                title: 'Trop de requêtes',
                category: 'DoS / Abus API',
                severity: 'CRITIQUE',
                user: 'null',
                user_agent: user_agent,
                action: 'Limiter les requêtes et bloquer temporairement la source',
                created_at: new Date()
            });
        } else {
            const lastCreated = new Date(existingAlert.created_at);
            const now = new Date();
            const timeDiff = now - lastCreated;
            const oneMinute = 60 * 1000;
            
            if (timeDiff >= oneMinute) {
                await this.alerts.insertOne({
                    ruleID: 'IDS-002',
                    title: 'Trop de requêtes',
                    category: 'DoS / Abus API',
                    severity: 'CRITIQUE',
                    user: 'null',
                    user_agent: user_agent,
                    action: 'Limiter les requêtes et bloquer temporairement la source',
                    created_at: new Date()
                });
            }
        }
    }

    async createAlertUnauthorizedAccess(user_agent, isExpired = false) {
        const ip = user_agent.ip || 'Unknown';
        
        const ruleID = isExpired ? 'IDS-005' : 'IDS-003';
        const title = isExpired ? 'Token JWT invalide' : 'Accès non autorisé';
        const category = isExpired ? 'Authentification' : 'Authorization';
        
        const existingAlert = await this.alerts.findOne(
            { 'user_agent.ip': ip, ruleID: ruleID },
            { sort: { created_at: -1 } }
        );
        
        if (!existingAlert) {
            await this.alerts.insertOne({
                ruleID: ruleID,
                title: title,
                category: category,
                severity: 'ÉLEVÉ',
                user: 'null',
                user_agent: user_agent,
                action: isExpired ? 'Refuser la requête et enregistrer l\'événement' : 'Refuser l\'accès et journaliser l\'événement',
                created_at: new Date()
            });
        } else {
            const lastCreated = new Date(existingAlert.created_at);
            const now = new Date();
            const timeDiff = now - lastCreated;
            const oneMinute = 60 * 1000;
            
            if (timeDiff >= oneMinute) {
                await this.alerts.insertOne({
                    ruleID: ruleID,
                    title: title,
                    category: category,
                    severity: 'ÉLEVÉ',
                    user: 'null',
                    user_agent: user_agent,
                    action: isExpired ? 'Refuser la requête et enregistrer l\'événement' : 'Refuser l\'accès et journaliser l\'événement',
                    created_at: new Date()
                });
            }
        }
    }

}

export default new AlertsServices()