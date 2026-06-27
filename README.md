# KamySoft POS & ERP — SaaS Multi-Tenant System

A premium, multi-tenant Web-based POS and ERP application with full bilingual (English & Arabic RTL) support.

## Live URLs
| URL | Purpose |
|-----|---------|
| `https://26i.uk` | Marketing landing page + store registration |
| `https://demo.26i.uk` | Public demo store |
| `https://26i.uk/admin` | **SaaS provider admin panel** |
| `https://{storename}.26i.uk` | Tenant store (e.g. `harby.26i.uk`) |

---

## ⚠️ CRITICAL: Wildcard DNS + IIS Setup for Tenant Subdomains

When a new store is created (e.g. `harby-mobile3`), it needs to be reachable at `harby-mobile3.26i.uk`.
This requires **two one-time configurations** on your server — DNS and IIS.

### Step 1 — Add Wildcard DNS Record (in your DNS Provider / Cloudflare)

Log in to wherever `26i.uk` DNS is managed (Cloudflare, GoDaddy, etc.) and add:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| `A` | `*` | `<your-server-IP>` | ✅ Proxied (or DNS only) |

This routes **every subdomain** (`*.26i.uk`) to your server IP.  
You only need to do this **once** — it covers all future stores.

> **Cloudflare users**: Go to DNS → Add Record → Type: A, Name: `*`, IPv4: `your-server-IP`, Proxied: ON

---

### Step 2 — Add Wildcard Host Binding in IIS

Open **IIS Manager** on the server:

1. Expand **Sites** → click your KamySoft site
2. In the **Actions** panel (right side) → click **Bindings…**
3. Click **Add**
4. Fill in:
   - **Type**: `https` (or `http` if not using SSL yet)
   - **IP Address**: `All Unassigned`
   - **Port**: `443` (or `80`)
   - **Host name**: `*.26i.uk`
5. Click **OK**

> If you already have a binding for `26i.uk`, keep it — add `*.26i.uk` as a **second binding** on the same site.

---

### Step 3 — SSL Certificate for Wildcard (HTTPS)

For HTTPS on all subdomains, your SSL certificate must be a **wildcard cert** for `*.26i.uk`.

**Option A — Certbot (Let's Encrypt) on the server:**
```bash
certbot certonly --manual --preferred-challenges dns -d "*.26i.uk" -d "26i.uk"
```
Then import the generated `.pem` files into IIS via the **Server Certificates** panel.

**Option B — Cloudflare SSL (recommended if using Cloudflare):**  
Set Cloudflare SSL mode to **Full** or **Full (Strict)**. Cloudflare handles the wildcard cert automatically — no IIS cert needed.

---

## Features
- **Multi-tenant SaaS**: Each store gets its own isolated MongoDB namespace at `storename.26i.uk`
- **POS / Cashier System**: Shopping cart with Saudi VAT (15%) and discounts
- **ZATCA-Compliant Invoicing**: Simplified Tax Invoices with QR codes (Phase 2)
- **A4 & Thermal Invoice Printing**: Both print formats bilingual (EN/AR)
- **Dashboard & Analytics**: Sales charts, low-stock alerts, multi-branch support
- **Provider Admin Panel**: Manage all tenant stores at `26i.uk/admin`

---

## IIS Deployment (Windows Server)

### Prerequisites
1. **Node.js** — Install on server
2. **IIS URL Rewrite** — [Download](https://www.iis.net/downloads/microsoft/url-rewrite)
3. **iisnode** — [Download](https://github.com/tjanczuk/iisnode)
4. **CGI Feature** — Enable via Server Manager → Add Roles → Web Server (IIS) → Application Development → CGI

### Deployment Steps

```bash
# 1. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 2. Install backend dependencies
npm install --production
```

1. Copy all files (including `server.js`, `package.json`, `web.config`, `frontend/dist/`) to `C:\inetpub\wwwroot\kamysoft-erp`
2. Open **IIS Manager** → Right-click **Sites** → **Add Website**
3. Set **Physical Path** to your folder
4. Add two **Host bindings**:
   - `26i.uk` → port 443
   - `*.26i.uk` → port 443 (wildcard — covers all tenant stores)
5. Grant `IIS_IUSRS` read/write on the folder

### Environment Variables (.env)

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/kamysoft-erp
JWT_SECRET=your-jwt-secret-here
SAAS_ADMIN_KEY=your-secret-admin-key
PORT=8089
```

> The `SAAS_ADMIN_KEY` is what you enter at `26i.uk/admin` to log in as the SaaS provider.  
> Default key (if not set): `kamysoft-saas-admin-2026`

---

## Docker Deployment

```bash
docker build -t kamysoft-erp:latest .
docker run -d --name kamysoft-erp -p 8089:80 \
  -e MONGODB_URI=mongodb://host:27017/kamysoft-erp \
  -e SAAS_ADMIN_KEY=your-secret-key \
  --restart unless-stopped \
  kamysoft-erp:latest
```

---

## MongoDB Index Fix (run once on first deployment)

If you see `E11000 duplicate key error` on product IDs, drop the old single-field index:

```bash
mongosh "mongodb://localhost:27017/kamysoft-erp" --eval "db.products.dropIndex('id_1')"
```

---

#   T r i g g e r   D e p l o y m e n t :   0 6 / 2 7 / 2 0 2 6