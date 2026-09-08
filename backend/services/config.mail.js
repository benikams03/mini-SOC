import dotenv from "dotenv"
dotenv.config()

class MailService {
    async sendMail(email, subject, HtmlContent) {
        try {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "Mini-SOC",
                        email: "benikams7@gmail.com"
                    },
                    to: [
                        {
                            email: email
                        }
                    ],
                    subject: subject,
                    htmlContent: HtmlContent,
                    headers: {
                        "List-Unsubscribe": "<mailto:benikams7@gmail.com>"
                    }
                })
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(`Brevo API error: ${error}`)
            }

            const result = await response.json()
            console.log("Email envoyé :", result.messageId)

        } catch (e) {
            console.error("Erreur envoi email :", e)
        }
    }
}

export const mail_service = new MailService()
