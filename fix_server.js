const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /if \(updateData\.success\) \{\s*console\.log\(`Successfully added Cloudflare Tunnel route for \$\{tenantDomain\}`\);\s*\} else \{\s*<cbc:IdentificationCode>SA<\/cbc:IdentificationCode>\s*<\/cac:Country>/;

const goodChunk = `if (updateData.success) {
            console.log(\`Successfully added Cloudflare Tunnel route for \${tenantDomain}\`);
        } else {
            console.error('Failed to update CF Tunnel config:', updateData.errors);
        }
    } catch (err) {
        console.error('Error updating Cloudflare Tunnel config:', err);
    }
}

// Function to generate ZATCA compliant XML
function generateZATCAXML(invoice, settings) {
    if (!settings) settings = { businessName: 'Unknown', vatNumber: '000000000000000' };
    
    let itemsXML = '';
    if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach((item, index) => {
            const lineTotal = item.price * item.qty;
            itemsXML += \`
    <cac:InvoiceLine>
        <cbc:ID>\${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="PCE">\${item.qty}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="SAR">\${lineTotal.toFixed(2)}</cbc:LineExtensionAmount>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="SAR">\${(lineTotal * 0.15).toFixed(2)}</cbc:TaxAmount>
            <cac:TaxSubtotal>
                <cbc:TaxableAmount currencyID="SAR">\${lineTotal.toFixed(2)}</cbc:TaxableAmount>
                <cbc:TaxAmount currencyID="SAR">\${(lineTotal * 0.15).toFixed(2)}</cbc:TaxAmount>
                <cac:TaxCategory>
                    <cbc:ID>S</cbc:ID>
                    <cbc:Percent>15.00</cbc:Percent>
                    <cac:TaxScheme>
                        <cbc:ID>VAT</cbc:ID>
                    </cac:TaxScheme>
                </cac:TaxCategory>
            </cac:TaxSubtotal>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Name>\${item.name}</cbc:Name>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="SAR">\${item.price.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>\`;
        });
    }

    const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
    <cbc:ID>\${invoice.id}</cbc:ID>
    <cbc:UUID>\${invoice.uuid}</cbc:UUID>
    <cbc:IssueDate>\${invoice.date.split(' ')[0]}</cbc:IssueDate>
    <cbc:IssueTime>\${invoice.date.split(' ')[1] || '00:00:00'}</cbc:IssueTime>
    <cbc:InvoiceTypeCode name="0111010">388</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
    <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
    <cac:AdditionalDocumentReference>
        <cbc:ID>ICV</cbc:ID>
        <cbc:UUID>\${invoice.csn}</cbc:UUID>
    </cac:AdditionalDocumentReference>
    <cac:AdditionalDocumentReference>
        <cbc:ID>PIH</cbc:ID>
        <cac:Attachment>
            <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">\${invoice.pih}</cbc:EmbeddedDocumentBinaryObject>
        </cac:Attachment>
    </cac:AdditionalDocumentReference>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PostalAddress>
                <cbc:StreetName>Riyadh</cbc:StreetName>
                <cbc:CityName>Riyadh</cbc:CityName>
                <cac:Country>
                    <cbc:IdentificationCode>SA</cbc:IdentificationCode>
                </cac:Country>`;

if (regex.test(code)) {
    code = code.replace(regex, goodChunk);
    fs.writeFileSync('server.js', code);
    console.log('Fixed successfully');
} else {
    console.log('Bad chunk not found');
}
