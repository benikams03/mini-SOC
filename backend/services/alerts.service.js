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

}

export default new AlertsServices()