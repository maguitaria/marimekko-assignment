# Infrastructure as Code (Terraform)

This folder contains Terraform configuration used to provision the cloud infrastructure for the Marimekko Wholesale storefront project.

The Terraform setup is split into two independently deployable stacks:

```

infra/
backend/   → Azure Function App (API)
frontend/  → Azure Static Web App (Next.js)

```

This separation allows the frontend and backend to be deployed and managed independently while still sharing a common resource group.

---

## Backend (Azure Function App)

### Provisions
| Resource | Purpose |
|---------|---------|
| Resource Group | Shared logical grouping for all project components |
| Storage Account | Required for Function App runtime state |
| Linux Functions Consumption Plan | Serverless execution environment |
| Azure Function App | Hosts the API logic (Node.js 20) |

### Configuration

```

cd infra/backend
cp terraform.tfvars.example terraform.tfvars   # Edit values
terraform init
terraform plan
terraform apply

```

### Outputs
| Output | Description |
|--------|-------------|
| `backend_api_url` | The public API endpoint (`https://<app>.azurewebsites.net/api`) |

This URL is used by the **frontend** to interact with the backend.




## Frontend (Azure Static Web App)

### Provisions
| Resource | Purpose |
|---------|---------|
| Static Web App (Free tier) | Hosts the built Next.js static site and provides global CDN edge delivery |

### Deployment Token
The Static Web App provides a **deployment token** which is required for CI/CD.

After apply:

```

cd infra/frontend
terraform output static_site_deployment_token

```

Add this value to GitHub Actions secrets:

```

AZURE_STATIC_WEB_APPS_API_TOKEN = <value>

```

### Deploy Flow
The frontend is deployed through GitHub Actions, not Terraform.  
Terraform only provisions the hosting environment.

---

## Environment Variables

Because the frontend is built as a **static export**, environment variables must be available **at build time**.

Set this in GitHub repo secrets:

```

NEXT_PUBLIC_API_URL = https://<function-app>.azurewebsites.net/api

```

> Do **not** rely on Azure Static Web App "Configuration" panel for runtime env — static apps substitute variables at build time.

---

## Existing Resource Deployments (Optional Import)

If the Azure resources were created manually, Terraform can adopt them using:

```

terraform import <resource> <Azure Resource ID>

```

This prevents Terraform from recreating or destroying existing cloud resources.

Example:
```

terraform import azurerm_linux_function_app.func /subscriptions/.../sites/<function-name>

```

---

## Notes
- Infrastructure is defined as code to ensure the application can be **reproduced consistently** in another environment.
- Frontend and Backend are intentionally separated so they can be scaled, secured, and deployed independently.
- GitHub Actions handle the application runtime deployments; Terraform provisions the underlying Azure environment.
##  Documentation & Reference Links

### Terraform
| Topic | Link |
|------|------|
| Terraform Website | https://www.terraform.io/ |
| Terraform Azure Provider Docs | https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs |
| Terraform `azurerm_linux_function_app` Resource | https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app |
| Terraform `azurerm_static_site` Resource | https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/static_site |
| How to Import Existing Azure Resources | https://developer.hashicorp.com/terraform/cli/import |

### Azure Services
| Service | Link |
|--------|------|
| Azure Static Web Apps | https://learn.microsoft.com/azure/static-web-apps/ |
| Azure Functions (Node.js) | https://learn.microsoft.com/azure/azure-functions/functions-reference-node |
| App Service Plans / Consumption Plan | https://learn.microsoft.com/azure/app-service/overview-hosting-plans |
| Resource Groups Overview | https://learn.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal |

### Deployment / CI/CD
| Topic | Link |
|------|------|
| Azure Static Web Apps GitHub Actions | https://learn.microsoft.com/azure/static-web-apps/github-actions-workflow |
| Azure Functions Deploy via GitHub Actions | https://learn.microsoft.com/azure/azure-functions/functions-deploy-github-actions |
| GitHub Secrets Setup | https://docs.github.com/actions/security-guides/encrypted-secrets |

---

These links provide reference for:

- modifying infrastructure,
- debugging deployments,
- and extending the environment in the future.
