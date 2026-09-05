import { database } from "../plugins/config.js";
import logsService from "../services/logs.service.js";

class UserController {

    constructor(){
        this.users = database.collection('users')
    }
    
    async getUsers(req, reply) {
        try {
            const users = await this.users.find({}).toArray();
            
            await logsService.createLogDataRetrieval('success', 'users', req.ip);
            
            reply.send({
                success: true,
                data: users
            });
        } catch (error) {
            await logsService.createLogDataRetrieval('error', 'users', req.ip);
            
            reply.send({
                success: false,
                message: error.message,
            })
        }
    }

}

export default new UserController();