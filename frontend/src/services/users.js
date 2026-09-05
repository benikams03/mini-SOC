import { api } from "./config.js";

export async function get_users() {
    try{
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}

export async function register_simulation(data) {
    try{
        const response = await api.post('/register-simulation', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}