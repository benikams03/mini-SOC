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

export async function resend_mail_inscription_admin(data) {
    try{
        const response = await api.post('/resend-register', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}

export async function login_admin(data) {
    try{
        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}

export async function confirm_code_login_admin(data) {
    try{
        const response = await api.post('/confirm-login', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}

export async function resend_code_login_admin(data) {
    try{
        const response = await api.post('/resend-login', data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false
        } 
    }
}