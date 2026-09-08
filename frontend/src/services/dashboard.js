import { api } from "./config.js";

export async function get_dashboard() {
    try{
        const response = await api.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}