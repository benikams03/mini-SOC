import { api } from "./config.js";

export async function loginSimulation(data) {
    try{
        const response = await api.post('/login-simulation', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de connexion'
        } 
    }
}
