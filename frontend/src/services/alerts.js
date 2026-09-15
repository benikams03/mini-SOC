import { api, ws } from "./config.js";

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

export function connectToAlertsLive(onMessage, onError, onClose) {
    const token = localStorage.getItem('access_token');
    const websocket = ws('alerts-live', token);

    websocket.onopen = () => {
        console.log('Connecté au flux d\'alertes en temps réel');
    };

    websocket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            onMessage(message);
        } catch (error) {
            console.error('Erreur lors du parsing du message WebSocket:', error);
        }
    };

    websocket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        if (onError) onError(error);
    };

    websocket.onclose = () => {
        console.log('Connexion WebSocket fermée');
        if (onClose) onClose();
    };

    return websocket;
}