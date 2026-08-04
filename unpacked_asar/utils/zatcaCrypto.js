const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Store keys locally for this initial phase
const KEYS_DIR = path.join(__dirname, '..', 'keys');

// Helper to encode TLV
function toTLV(tag, value) {
    const valueBuffer = Buffer.from(value);
    const tagBuffer = Buffer.from([tag]);
    // ZATCA specs use 1 byte for length in typical cases (all lengths here are < 255)
    // Note: if length >= 256, it requires multiple bytes (not covered in basic TLV for this size)
    let lengthBuffer;
    if (valueBuffer.length < 128) {
        lengthBuffer = Buffer.from([valueBuffer.length]);
    } else {
        lengthBuffer = Buffer.from([0x81, valueBuffer.length]);
    }
    
    return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer]);
}

/**
 * Generate ECDSA secp256k1 key pair and save to local files
 */
function onboardDevice(tenantId = 'default') {
    if (!fs.existsSync(KEYS_DIR)) {
        fs.mkdirSync(KEYS_DIR, { recursive: true });
    }
    const privateKeyPath = path.join(KEYS_DIR, `${tenantId}_private.pem`);
    const publicKeyPath = path.join(KEYS_DIR, `${tenantId}_public.pem`);

    // Generate keys
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
    });

    const privateKeyPem = privateKey.export({
        type: 'pkcs8',
        format: 'pem',
    });

    const publicKeyPem = publicKey.export({
        type: 'spki',
        format: 'pem',
    });

    fs.writeFileSync(privateKeyPath, privateKeyPem);
    fs.writeFileSync(publicKeyPath, publicKeyPem);

    return { publicKeyPem, privateKeyPem };
}

/**
 * Load keys if they exist
 */
function getKeys(tenantId = 'default') {
    const privateKeyPath = path.join(KEYS_DIR, `${tenantId}_private.pem`);
    const publicKeyPath = path.join(KEYS_DIR, `${tenantId}_public.pem`);
    
    if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
        return {
            privateKeyPem: fs.readFileSync(privateKeyPath, 'utf8'),
            publicKeyPem: fs.readFileSync(publicKeyPath, 'utf8')
        };
    }
    return null;
}

/**
 * Simplified Canonicalization (C14N) for ZATCA XML 
 */
function canonicalizeXML(xmlString) {
    return xmlString.replace(/\r\n/g, '\n').trim();
}

/**
 * Sign XML Hash using ECDSA secp256k1
 */
function signInvoice(xmlString, privateKeyPem) {
    const canonicalXML = canonicalizeXML(xmlString);
    const hash = crypto.createHash('sha256').update(canonicalXML).digest();
    
    const sign = crypto.createSign('SHA256');
    sign.update(canonicalXML);
    sign.end();
    
    const signature = sign.sign(privateKeyPem);
    
    return {
        xmlHashBase64: hash.toString('base64'),
        xmlHashHex: hash.toString('hex'),
        signatureBase64: signature.toString('base64'),
        signatureHex: signature.toString('hex')
    };
}

/**
 * Generate ZATCA Phase 2 TLV QR Code (Base64)
 */
function generateZatcaQR(
    sellerName,
    vatNumber,
    timestamp,
    invoiceTotal,
    vatTotal,
    xmlHashHex,
    signatureHex,
    publicKeyPem
) {
    try {
        const tlv1 = toTLV(1, sellerName);
        const tlv2 = toTLV(2, vatNumber);
        const tlv3 = toTLV(3, timestamp);
        const tlv4 = toTLV(4, invoiceTotal.toString());
        const tlv5 = toTLV(5, vatTotal.toString());
        
        // Tags 6, 7, 8 require binary conversion from their hex representations
        const tlv6 = toTLV(6, Buffer.from(xmlHashHex, 'hex'));
        const tlv7 = toTLV(7, Buffer.from(signatureHex, 'hex'));
        
        // Extract raw public key bytes from PEM (strip header/footer)
        const pkBase64 = publicKeyPem
            .replace(/-----BEGIN PUBLIC KEY-----/g, '')
            .replace(/-----END PUBLIC KEY-----/g, '')
            .replace(/\n/g, '')
            .replace(/\r/g, '');
        const tlv8 = toTLV(8, Buffer.from(pkBase64, 'base64'));

        const tlv9 = toTLV(9, Buffer.from('mock-zatca-stamp', 'utf8'));

        const qrBuffer = Buffer.concat([tlv1, tlv2, tlv3, tlv4, tlv5, tlv6, tlv7, tlv8, tlv9]);
        return qrBuffer.toString('base64');
    } catch (e) {
        console.error('QR Gen error:', e);
        return null;
    }
}

module.exports = {
    onboardDevice,
    getKeys,
    signInvoice,
    generateZatcaQR
};
