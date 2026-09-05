import { api } from "./config.js";

export async function get_logs() {
    try{
        const response = await api.get('/logs');
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}