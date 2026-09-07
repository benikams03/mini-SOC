import { database } from "../plugins/config.js";
import logsService from "../services/logs.service.js";

class DashboardController {

    constructor(){
        this.alerts = database.collection('alerts')
        this.logs = database.collection('logs')
        this.users = database.collection('users')
    }
    
    async getDashboard(req, reply) {
        try {
            // Récupérer les 5 dernières alertes du plus récent au plus ancien
            const recentAlerts = await this.alerts
                .find({})
                .sort({ created_at: -1 })
                .limit(5)
                .toArray();

            // Compter le nombre total d'alertes
            const alertsCount = await this.alerts.countDocuments();

            // Compter le nombre total de logs
            const logsCount = await this.logs.countDocuments();

            // Compter le nombre total d'utilisateurs
            const usersCount = await this.users.countDocuments();

            await logsService.createLogDataRetrieval('success', 'dashboard', req.ip);
            
            reply.send({
                success: true,
                data: {
                    recentAlerts: recentAlerts,
                    alertsCount: alertsCount,
                    logsCount: logsCount,
                    usersCount: usersCount
                }
            });
        } catch (error) {
            await logsService.createLogDataRetrieval('error', 'dashboard', req.ip);
            
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

}

export default new DashboardController();