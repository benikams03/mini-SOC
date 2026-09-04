import { api } from "./config.js";

export async function Inscription_admin(data) {
    try{
        const response = await api.post('/register', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}