import { api } from "./config.js";

export async function sqlInjectionSimulation(data) {
    try{
        const response = await api.post('/simulation/sql-injection', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}

export async function xssSimulation(data) {
    try{
        const response = await api.post('/simulation/xss', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}

export async function pathTraversalSimulation(data) {
    try{
        const response = await api.post('/simulation/path-traversal', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}
