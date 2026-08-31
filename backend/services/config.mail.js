import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_LOGIN,
                pass: process.env.BREVO_SMTP_KEY
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendMail(email, subject, HtmlContent) {
        try {
            const mailOptions = {
                from: `"Mini-SOC" <benikams7@gmail.com>`,
                to: email,
                subject: subject,
                html: HtmlContent,
                headers: {
                    'List-Unsubscribe': `<mailto:benikams7@gmail.com>`
                }
            }

            const res = await this.transporter.sendMail(mailOptions)
            // console.log(res);
        } catch(e) {
            console.error(e);
        }
    }
}

export const mail_service = new MailService()
