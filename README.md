

#  Marimekko B2B Application

This project is a simple **B2B wholesale storefront** that demonstrates how two different clients (Client A and Client B) can log in and view the same product catalog but with **client-specific stock levels and pricing**.
It includes a **Next.js (static export) frontend**, an **Azure Functions backend**, and **Terraform** configuration for reproducible infrastructure deployment.

---
##  Screenshots

| Pages | Preview |
|--------|---------|
|Dashboard| ![Dashboard](frontend\public\screenshots\dashboard.png) |
|Login page| ![Login](frontend\public\screenshots\login.png) |
| API Health Status  | ![API](frontend\public\screenshots\health_status.png) |

##  Architecture Overview

```
Azure Resource Group
│
├── Azure Static Web App  (Frontend)
│     • Next.js (Static Export)
│     • Hosted via GitHub Actions
│     • Uses environment variable: NEXT_PUBLIC_API_BASE
│
└── Azure Function App    (Backend API)
      • Node.js runtime (~4)
      • Endpoints:
            GET  /api/            → HTML index page
            POST /api/login       → Authenticate client code → JWT
            GET  /api/products    → Client-specific products
      • Reads per-client configs from /config/
      • Env vars: CLIENT_A_CODE, CLIENT_B_CODE, JWT_SECRET
```

###  Authentication Flow

1. Client enters a login code (`1234` or `5678`).
2. Backend resolves client ID (`clientA` / `clientB`) from environment variables.
3. A JWT is generated and returned to the frontend.
4. All subsequent API calls include the JWT for client identification.

---

##  Deployed URLs

| Component                    | URL                                                                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (Next.js)**       | [https://mango-forest-0de58f81e.3.azurestaticapps.net](https://mango-forest-0de58f81e.3.azurestaticapps.net)                                                         |
| **Backend (Azure Function)** | [https://clientstore-func-dcgdbhcfaacresd8.canadacentral-01.azurewebsites.net/api](https://clientstore-func-dcgdbhcfaacresd8.canadacentral-01.azurewebsites.net/api) |

---

##  Example Login Codes

| Client   | Code (example) |
| -------- | -------------- |
| Client A | `1234`         |
| Client B | `5678`         |

*(In production, these are stored as environment variables `CLIENT_A_CODE` and `CLIENT_B_CODE`.)*

---

##  Project Structure

```
frontend/
  ├── pages/
  ├── components/
  ├── public/
  ├── package.json
  └── next.config.js

api/
  ├── index.js            ← Root /api endpoint
  ├── login.js            ← JWT login
  ├── products.js         ← Client-specific pricing + stock
  └── utils/
        └── clients.js    ← Reads config & maps codes

config/
  ├── clientA.json
  └── clientB.json

terraform/
  ├── main.tf
  ├── backend.tf
  ├── frontend.tf
  ├── providers.tf
  ├── variables.tf
  └── outputs.tf
```

---

## Local Development Setup

### Prerequisites

* Node.js ≥ 18
* Azure Functions Core Tools
* Terraform ≥ 1.6
* Azure CLI (logged in with `az login`)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your_username>/clientstore.git
cd clientstore

# 2. Set environment variables (for local use)
cp api/local.settings.example.json api/local.settings.json
# edit with your CLIENT_A_CODE, CLIENT_B_CODE, JWT_SECRET

# 3. Run backend locally
cd api
func start

# 4. Run frontend locally
cd ../frontend
npm install
NEXT_PUBLIC_API_BASE=http://localhost:7071/api npm run dev
```

Open `http://localhost:3000` in your browser.

---

##  Deployment via GitHub Actions

This repository uses **two GitHub Actions workflows**:

### Frontend – Azure Static Web Apps

Located at `.github/workflows/frontend.yml`:

```yaml
name: Deploy Frontend (Next.js Static Export)

on:
  push:
    branches: [ master ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_API_BASE: ${{ secrets.NEXT_PUBLIC_API_BASE }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
        working-directory: ./frontend
      - run: npm run build
        working-directory: ./frontend
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          app_location: "./frontend"
          output_location: "out"
```

Required GitHub repository secrets:

```
NEXT_PUBLIC_API_BASE = https://clientstore-func-...azurewebsites.net/api
AZURE_STATIC_WEB_APPS_API_TOKEN = <token from Azure Static Web App>
```

---

###  Backend – Azure Function App

You can deploy your backend either manually or via another workflow:

```yaml
name: Deploy Backend (Azure Functions)

on:
  push:
    branches: [ master ]

jobs:
  deploy_backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Deploy Function App
        uses: Azure/functions-action@v1
        with:
          app-name: "clientstore-func"
          package: "api"
        env:
          CLIENT_A_CODE: ${{ secrets.CLIENT_A_CODE }}
          CLIENT_B_CODE: ${{ secrets.CLIENT_B_CODE }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

Required GitHub secrets:

```
AZURE_CREDENTIALS = <JSON from az ad sp create-for-rbac>
CLIENT_A_CODE
CLIENT_B_CODE
JWT_SECRET
```

---

## Infrastructure as Code (Terraform)

To reproduce the Azure environment:

### Setup

```bash
cd terraform
az login
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

This provisions:

* Resource group
* Azure Function App (Node ~4)
* Storage account
* (Optional) Azure Static Web App
* Environment variables and CORS config

To clean up:

```bash
terraform destroy
```

---

## How Client Logic Works

Each client’s stock/pricing configuration is defined in `config/clientA.json` and `config/clientB.json`.

Example:

```json
{
  "displayName": "Client A",
  "priceMultiplier": 1.0,
  "stockOverrides": { "sku-001": 120 }
}
```

The backend dynamically loads these using:

```js
export function getClientProfile(clientId) {
  const filePath = path.join(__dirname, `../../config/${clientId}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
```

---

##  Feedback & Troubleshooting

| Problem                     | Likely Cause                                | Fix                                          |
| --------------------------- | ------------------------------------------- | -------------------------------------------- |
| `undefined/login` API calls | Frontend env var not injected at build time | Set `NEXT_PUBLIC_API_BASE` in workflow       |
| `CORS policy blocked`       | Missing CORS header                         | Add frontend URL to Function App CORS config |
| `Function not found`        | Double slashes in route                     | Use `route: ""` for index function           |



##  Contributor

**Developer:** Mariia Glushenkova, mariia.glushenkova@gmail.com


