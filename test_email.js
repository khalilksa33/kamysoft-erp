require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || "SME Solutions <info@26i.uk>",
            to: "test@example.com",
            subject: 'Test Email',
            html: `<b>Hello world?</b>`,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (e) {
        console.error("Error sending email:", e);
    }
}

test();
