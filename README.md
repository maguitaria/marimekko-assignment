
# Marimekko Wholesale Storefront

This project is a multi-tenant wholesale storefront system built with:

- **Frontend:** Next.js 16 (App Router) deployed to **Azure Static Web Apps**
- **Backend:** Azure Functions (Node.js 20) deployed to **Azure Function App**
- **Infrastructure:** Terraform (resource group, function app, config variables)
- **Client-specific behavior:** Stock & pricing are filtered dynamically per client

---

## 🌍 Live Deployment

| Component | URL |
|---------|-----|
| **Client Storefront (Frontend)** | [Azure Frontend SWA](https://green-island-0e814a30f.3.azurestaticapps.net) |
| **API (Azure Function App)** | https://clientstore-func-dcgdbhcfaacresd8.canadacentral-01.azurewebsites.net/api |

> Replace the placeholder URLs above with your actual deployed URLs from Azure.

---

## 🔐 Client Login Codes

| Client | Login Code | Effect |
|-------|------------|--------|
| **Client A** | `CLIENTA123` | Shows Client A pricing & stock rules |
| **Client B** | `CLIENTB456` | Shows Client B pricing & stock rules |

No password is required — clients log in by entering their assigned code on the landing screen.

---

## 🧠 How Client-Specific Pricing & Stock Logic Works

The backend stores:

- A **base catalog** (full product list with SKU, name, image, base price)
- A **client mapping** that adjusts:
  - Allowed SKUs
  - Price multipliers or overrides
  - Stock visibility behavior

When a client logs in:

1. The code identifies the client in the **client map**
2. The API filters the base catalog
3. The adjusted data is returned to the frontend
4. The frontend renders only data allowed for that client

**No client logic is stored in browser code** → prevents data leakage.

---

## 🏗 Project Structure

```

.
├── frontend/                  # Next.js application
│   ├── app/                   # App Router (pages)
│   ├── components/            # UI components
│   ├── styles/                # Tailwind & font config
│   └── package.json
│
├── api/                       # Azure Function App (Node.js backend)
│   ├── functions/             # HTTP-trigger functions
│   ├── catalog.json           # Base product list
│   ├── clientMap.json         # Per-client rules
│   └── package.json
│
└── infra/                     # Terraform IaC configuration
├── main.tf
├── variables.tf
├── outputs.tf
└── README.md (optional)

````

---

## ▶️ Local Development

### 1. Start Backend (API)

```bash
cd api
npm install
npm run start
````

The API runs at:

```
http://localhost:7071
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```
http://localhost:3000
```

> Ensure the environment variable in `frontend/.env.local` points to your API:

```
NEXT_PUBLIC_API_BASE=http://localhost:7071
```

---

## ☁️ Deployment

### Frontend → Azure Static Web Apps (CI/CD)

Triggered automatically on push to `master`.
Builds `.next` and uploads via GitHub Action.

### Backend → Azure Function App (CI/CD)

GitHub Actions zips and deploys build artifacts using a **Service Principal**.

---

## 🏛 Infrastructure (Terraform)

Terraform provisions:

* Resource Group
* Azure Function App + Storage
* App settings (base catalog, client map, CORS settings)

To deploy infrastructure:

```bash
cd infra
az login
terraform init
terraform plan
terraform apply
```
