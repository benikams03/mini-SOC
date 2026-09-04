import { mail_service } from "./config.mail.js";

class SendMail {

    async Welcome(email, id) {
        try{

            await mail_service.sendMail(
                email, 
                "Bienvenu sur Mini-SOC", 
                `
                    <h1>Bienvenu sur Mini-SOC ${email}</h1>
                    <p>Vous avez reçu cet email car vous avez créé un compte sur Mini-SOC.</p>
                    <p>Vueillez cliquez sur le lien suivant pour confirmer votre adresse email : 
                    <a href="http://localhost:5050/api/v1/confirm-register/${id}">Confirmer</a></p>
                `);

        } catch (error) {
            console.error(error);
        }
    }
}

export const send_mail = new SendMail();