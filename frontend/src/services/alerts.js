import { api } from "./config.js";

export async function get_alerts() {
    try{
        const response = await api.get('/alerts');
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}