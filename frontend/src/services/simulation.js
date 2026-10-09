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

export async function csrfSimulation(data) {
    try{
        const response = await api.post('/simulation/csrf', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}

export async function commandInjectionSimulation(data) {
    try{
        const response = await api.post('/simulation/command-injection', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}

export async function ssrfSimulation(data) {
    try{
        const response = await api.post('/simulation/ssrf', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Erreur de simulation'
        }
    }
}
