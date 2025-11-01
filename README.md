# Digital Wholesale Cloud Engineer – Practice Assignment

This repo implements a simple B2B wholesale storefront where two different wholesale clients
log in with a client-specific code and see **different stock levels and pricing** for the same products.

## Architecture

- **Frontend**: Next.js 14 (app router). Hosted on Vercel (or Azure Static Web Apps).
- **Backend**: Azure Functions v4 (Node 18, TypeScript). Endpoints:
  - `POST /api/login` → `{ code }` → `{ token, clientId, clientName }`
  - `GET /api/products` (Bearer token) → `{ products: [{ id, name, price, stock }] }`
- **Infrastructure**: Terraform provisions:
  - Resource Group, Storage Account, Linux Consumption Function App
  - App settings for JWT secret, base catalog, and client mapping (no codes hard-coded in repo)

## Client-specific logic

- **Base catalog** (mock) is set via `BASE_CATALOG_JSON` app setting.
- **Client profiles** and **code→client mapping** are set via `CLIENT_MAP_JSON`.
- Pricing strategies supported:
  - `multiplier` e.g., `0.9` for 10% discount
  - `override` `{ "SKU-1": 39.99, ... }` for per-SKU price overrides
- Stock strategies supported:
  - `cap` (max stock visible per SKU)
  - `override` per-SKU stock
- The **same catalog** is returned, but `price` and `stock` are computed per client.

## Example login codes

- **Client A**: `1234` → 10% discount, stock capped at 40
- **Client B**: `5678` → 10% surcharge, stock capped at 15

*(Change these in Terraform/app settings; not hard-coded in source.)*

## Local development

### API
```bash
cd api
cp local.settings.json.example local.settings.json 
npm install
npm run dev   # requires Azure Functions Core Tools installed. Refer to Microsoft Docs # Digital Wholesale Cloud Engineer – Practice Assignment

This repo implements a simple B2B wholesale storefront where two different wholesale clients
log in with a client-specific code and see **different stock levels and pricing** for the same products.

## Architecture

- **Frontend**: Next.js 14 (app router). Hosted on Vercel (or Azure Static Web Apps).
- **Backend**: Azure Functions v4 (Node 18, TypeScript). Endpoints:
  - `POST /api/login` → `{ code }` → `{ token, clientId, clientName }`
  - `GET /api/products` (Bearer token) → `{ products: [{ id, name, price, stock }] }`
- **Infrastructure**: Terraform provisions:
  - Resource Group, Storage Account, Linux Consumption Function App
  - App settings for JWT secret, base catalog, and client mapping (no codes hard-coded in repo)

## Client-specific logic

- **Base catalog** (mock) is set via `BASE_CATALOG_JSON` app setting.
- **Client profiles** and **code→client mapping** are set via `CLIENT_MAP_JSON`.
- Pricing strategies supported:
  - `multiplier` e.g., `0.9` for 10% discount
  - `override` `{ "SKU-1": 39.99, ... }` for per-SKU price overrides
- Stock strategies supported:
  - `cap` (max stock visible per SKU)
  - `override` per-SKU stock
- The **same catalog** is returned, but `price` and `stock` are computed per client.

## Example login codes

- **Client A**: `1234` → 10% discount, stock capped at 40
- **Client B**: `5678` → 10% surcharge, stock capped at 15

*(Change these in Terraform/app settings; not hard-coded in source.)*

## Local development

### API
```bash
cd api
cp local.settings.json.example local.settings.json  # edit if needed
npm install
npm run dev   # requires Azure Functions Core Tools http://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=node-v4%2Cpython-v2%2Cisolated-process%2Cquick-create&pivots=programming-language-csharp

