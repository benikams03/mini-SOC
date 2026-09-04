import { api } from "./config.js";

export async function get_logs(data) {
    try{
        const response = await api.get('/logs', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}