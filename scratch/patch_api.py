import sys

api_path = 'routes/api.js'
with open(api_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
for line in lines:
    out_lines.append(line)
    if "const express = require('express');" in line:
        out_lines.append("const nodemailer = require('nodemailer');\n")
        out_lines.append("const sgMail = require('@sendgrid/mail');\n")
    if "router.post('/api/settings', authenticateToken, async (req, res) => {" in line:
        api_route = """
router.post('/api/send-email', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        let settings = null;
        if (global.isMongoConnected) {
            settings = await Settings.findOne({ tenantId });
        } else {
            settings = mockDb.settingsTenant[tenantId] || mockDb.settings;
        }

        if (!settings || !settings.smtp || !settings.smtp.host && settings.smtp.provider !== 'sendgrid') {
            return res.status(400).json({ error: 'SMTP settings not configured' });
        }

        const { to, subject, html } = req.body;
        const smtp = settings.smtp;

        if (smtp.provider === 'sendgrid') {
            if (!smtp.sendgridApiKey) return res.status(400).json({ error: 'SendGrid API key not configured' });
            sgMail.setApiKey(smtp.sendgridApiKey);
            const msg = {
                to,
                from: smtp.fromEmail || 'test@example.com',
                subject,
                html,
            };
            await sgMail.send(msg);
        } else {
            let transporter = nodemailer.createTransport({
                host: smtp.host,
                port: smtp.port,
                secure: smtp.port == 465, // true for 465, false for other ports
                auth: {
                    user: smtp.user,
                    pass: smtp.password,
                },
            });
            await transporter.sendMail({
                from: smtp.fromEmail || smtp.user,
                to,
                subject,
                html,
            });
        }
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
        console.error('Email sending error:', err);
        res.status(500).json({ error: err.message });
    }
});

"""
        out_lines.insert(-1, api_route)

with open(api_path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("api.js patched.")
