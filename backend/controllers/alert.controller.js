import { database } from "../plugins/config.js";
import logsService from "../services/logs.service.js";

class AlertController {

    constructor(){
        this.alerts = database.collection('alerts')
    }
    
    async getAlerts(req, reply) {
        try {
            const alerts = await this.alerts.find({}).toArray();
            
            await logsService.createLogDataRetrieval('success', 'alerts', req.ip);
            
            reply.send({
                success: true,
                data: alerts
            });
        } catch (error) {
            await logsService.createLogDataRetrieval('error', 'alerts', req.ip);
            
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

}

export default new AlertController();