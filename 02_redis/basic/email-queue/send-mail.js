import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export default async function sendMail(data) {
    const { email, to, subject, text, html } = data || {};
    const recipient = email || to;

    if (!recipient) {
        throw new Error("No recipient email provided to sendMail");
    }

    console.log(`[Email Service] Sending email to: ${recipient}`);

    const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: recipient,
        subject: subject || "Welcome!",
        text: text || `Hello, your email address (${recipient}) has been registered successfully.`,
        html: html || `<p>Hello,</p><p>Your email address (<strong>${recipient}</strong>) has been registered successfully.</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Mail sent successfully to ${recipient}. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[Email Service] Error sending mail to ${recipient}:`, error.message);
        throw error;
    }
}

