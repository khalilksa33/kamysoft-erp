# KamySoft POS & ERP System

A premium, state-of-the-art Web-based POS and ERP application for **KamySoft** with full native bilingual (English & Arabic RTL) support.

## Access URL
- Live Site: [https://erp.26i.uk](https://erp.26i.uk)

## Features
- **POS / Cashier System**: Modern shopping cart with automatic Saudi VAT (15%) and discount calculation.
- **ZATCA-Compliant Invoicing**: Generates Saudi Fatoora e-invoice QR codes in Simplified Tax Invoices.
- **Dashboard & Analytics**: Dynamic lines charts for sales tracking and low-stock alerts.
- **Bilingual Interface**: Seamlessly toggles English and Arabic layout alignment and typography.

## Docker Deployment
Run the app via Docker:
```bash
docker build -t kamysoft-erp:latest .
docker run -d --name kamysoft-erp -p 8089:80 --restart unless-stopped kamysoft-erp:latest
```
