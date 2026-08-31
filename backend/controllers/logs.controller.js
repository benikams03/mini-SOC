import { database } from "../plugins/config.js";

class LogsController {

    constructor(){
        this.logs = database.collection('logs')
    }
    
    async get(req, reply) {  
        try{
            
            const logs = await this.logs.find().toArray();

            reply.send({
                success: true,
                data: logs
            })

        } catch (error) {
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }



}

export default new LogsController();