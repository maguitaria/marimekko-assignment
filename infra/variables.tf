variable "project_name" {
  type = string
}

variable "location" {
  type    = string
  default = "westeurope"
}

variable "resource_group_name" {
  type = string
}

variable "jwt_secret" {
  type = string
}

variable "base_catalog_json" {
  type = string
}

variable "client_map_json" {
  type = string
}

variable "cors_allow_origin" {
  type    = string
  default = "*"
}
