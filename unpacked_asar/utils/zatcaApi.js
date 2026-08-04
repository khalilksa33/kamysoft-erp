const fs = require('fs');
const crypto = require('crypto');

/**
 * Helper to get the correct API base URL based on environment
 */
function getBaseUrl(env) {
    switch (env) {
        case 'simulation':
            return 'https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation';
        case 'production':
            return 'https://gw-fatoora.zatca.gov.sa/e-invoicing/core';
        case 'sandbox':
        default:
            return 'https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal';
    }
}

/**
 * Register the device (Get CCSID)
 * Endpoint: /compliance
 */
async function registerDevice(otp, csrPem, env = 'sandbox') {
    const baseUrl = getBaseUrl(env);
    
    const response = await fetch(`${baseUrl}/compliance`, {
        method: 'POST',
        headers: {
            'OTP': otp,
            'Accept-Version': 'V2',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csr: Buffer.from(csrPem).toString('base64') })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to register device with ZATCA');
    }

    return {
        certificate: Buffer.from(data.binarySecurityToken, 'base64').toString('utf-8'),
        secret: data.secret
    };
}

/**
 * Clearance API for Standard Invoices
 * Endpoint: /invoices/clearance
 */
async function clearInvoice(invoiceXmlBase64, invoiceHashHex, certPem, secret, env = 'sandbox') {
    const baseUrl = getBaseUrl(env);
    
    const tokenStr = Buffer.from(certPem).toString('base64');
    const authHeader = `Basic ${Buffer.from(`${tokenStr}:${secret}`).toString('base64')}`;

    const payload = {
        invoiceHash: invoiceHashHex,
        uuid: crypto.randomUUID(),
        invoice: invoiceXmlBase64
    };

    const response = await fetch(`${baseUrl}/invoices/clearance`, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Accept-Version': 'V2',
            'Accept-Language': 'en',
            'Clearance-Status': '1',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Clearance Failed: ${JSON.stringify(data)}`);
    }

    return data;
}

/**
 * Reporting API for Simplified Invoices
 * Endpoint: /invoices/reporting/single
 */
async function reportInvoice(invoiceXmlBase64, invoiceHashHex, certPem, secret, env = 'sandbox') {
    const baseUrl = getBaseUrl(env);
    
    const tokenStr = Buffer.from(certPem).toString('base64');
    const authHeader = `Basic ${Buffer.from(`${tokenStr}:${secret}`).toString('base64')}`;

    const payload = {
        invoiceHash: invoiceHashHex,
        uuid: crypto.randomUUID(),
        invoice: invoiceXmlBase64
    };

    const response = await fetch(`${baseUrl}/invoices/reporting/single`, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Accept-Version': 'V2',
            'Accept-Language': 'en',
            'Clearance-Status': '0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Reporting Failed: ${JSON.stringify(data)}`);
    }

    return data;
}

module.exports = {
    registerDevice,
    clearInvoice,
    reportInvoice
};
