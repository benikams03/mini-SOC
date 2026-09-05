import { database } from "../plugins/config.js";
import logsService from "../services/logs.service.js";

class LogsController {

    constructor(){
        this.logs = database.collection('logs')
    }
    
    async get(req, reply) {  
        try{
            
            const logs = await this.logs.find().toArray();

            await logsService.createLogDataRetrieval('success', 'logs', req.ip);

            reply.send({
                success: true,
                data: logs
            })

        } catch (error) {
            await logsService.createLogDataRetrieval('error', 'logs', req.ip);
            
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }



}

export default new LogsController();