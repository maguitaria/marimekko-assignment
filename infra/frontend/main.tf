terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.70"
    }
  }

  backend "local" {
    path = "./terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# Resource Group (reuse same RG as backend)
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Create Static Web App
resource "azurerm_static_site" "frontend" {
  name                = "${var.project_name}-frontend"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    project     = var.project_name
    environment = var.environment
  }
}

# Output deployment token so you can copy it into GitHub Actions
output "static_web_app_deployment_token" {
  value     = azurerm_static_site.frontend.api_key
  sensitive = true
}
