# Marimekko Wholesale API

A TypeScript-based Azure Functions API for managing client-specific wholesale product catalogs with customizable pricing and inventory rules.

## Overview

This API provides a secure wholesale system where different clients can access the same product catalog but with personalized pricing and stock levels based on their business agreements. Each client receives a customized view of products through JWT-based authentication.

## Features

- **Client Authentication**: JWT-based authentication system with time-limited tokens
- **Personalized Pricing**: Support for multiplier-based discounts or per-product price overrides
- **Dynamic Inventory**: Configurable stock levels with capping or per-product overrides
- **Secure Access**: Token-based authorization with client-specific access controls
- **CORS Support**: Configurable cross-origin resource sharing for web clients

## Architecture

### Project Structure

```
api/
├── src/
│   ├── functions/
│   │   ├── login.ts          # Authentication endpoint
│   │   └── products.ts       # Product catalog endpoint
│   ├── types.ts              # TypeScript type definitions
│   └── util.ts               # Utility functions
├── host.json                 # Azure Functions host configuration
├── local.settings.json       # Local development settings
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### Core Components

1. **Authentication System** (`login.ts`, `util.ts`)
   - Code-to-client ID resolution
   - JWT token generation and verification
   - Client profile management

2. **Product Catalog** (`products.ts`, `util.ts`)
   - Base catalog transformation
   - Client-specific pricing application
   - Dynamic stock level computation

3. **Type System** (`types.ts`)
   - Comprehensive TypeScript definitions
   - Client profile configuration schemas
   - Catalog item structures

## API Endpoints

### POST `/api/login`

Authenticates a client using a provided code and returns a JWT token.

**Request Body:**
```json
{
  "code": "string"
}
```

**Success Response (200):**
```json
{
  "token": "jwt_token_string",
  "clientId": "client_identifier",
  "clientName": "Client Display Name"
}
```

**Error Responses:**
- `400`: Missing code
- `401`: Invalid code
- `500`: Server error or client profile not found

### GET `/api/products`

Retrieves the client-specific product catalog with personalized pricing and stock.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "stock": 50
    }
  ]
}
```

**Error Responses:**
- `401`: Missing, invalid token, or unknown client

## Configuration

### Environment Variables

The API requires the following environment variables:

```env
# JWT Secret for token signing/verification
JWT_SECRET=your_jwt_secret_key

# Base product catalog (JSON array)
BASE_CATALOG_JSON=[{"id":"item1","name":"Product 1","basePrice":100,"baseStock":50}]

# Client mapping configuration (JSON object)
CLIENT_MAP_JSON={"client-a":{"name":"Client A","pricing":{"type":"multiplier","value":0.9},"stock":{"type":"cap","value":25}},"1234":"client-a"}

# CORS configuration (optional)
CORS_ALLOW_ORIGIN=*
```

### Client Configuration

Clients are configured in `CLIENT_MAP_JSON` with the following structure:

```json
{
  "client-id": {
    "name": "Client Display Name",
    "pricing": {
      "type": "multiplier|override",
      "value": 0.9,                    // For multiplier type
      "map": {"item1": 89.99}          // For override type
    },
    "stock": {
      "type": "cap|override",
      "value": 25,                     // For cap type
      "map": {"item1": 10}             // For override type
    }
  },
  "auth-code": "client-id"             // Maps auth codes to client IDs
}
```

#### Pricing Types

- **Multiplier**: Applies a percentage discount to all base prices
  ```json
  "pricing": { "type": "multiplier", "value": 0.9 }  // 10% discount
  ```

- **Override**: Sets specific prices for individual products
  ```json
  "pricing": { 
    "type": "override", 
    "map": { "product1": 89.99, "product2": 149.99 } 
  }
  ```

#### Stock Types

- **Cap**: Limits maximum stock shown to client
  ```json
  "stock": { "type": "cap", "value": 25 }  // Max 25 units per product
  ```

- **Override**: Sets specific stock levels for individual products
  ```json
  "stock": { 
    "type": "override", 
    "map": { "product1": 10, "product2": 100 } 
  }
  ```

## Development

### Prerequisites

- Node.js 18+ and npm
- Azure Functions Core Tools v4
- TypeScript

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure local settings:**
   ```bash
   cp local.settings.json.example local.settings.json
   # Edit local.settings.json with your configuration
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start Azure Functions runtime
- `npm run dev` - Build and start development server
- `npm run deploy:prepare` - Prepare for deployment (install and build)

### Local Development

The API runs locally on `http://localhost:7071` with the following endpoints:
- `POST http://localhost:7071/api/login`
- `GET http://localhost:7071/api/products`

### Testing

Example authentication flow:

```bash
# 1. Login with client code
curl -X POST http://localhost:7071/api/login \
  -H "Content-Type: application/json" \
  -d '{"code":"1234"}'

# 2. Use returned token to access products
curl -X GET http://localhost:7071/api/products \
  -H "Authorization: Bearer <token_from_step_1>"
```

## Deployment

This API is designed for deployment to Azure Functions. Use the Azure Functions extension for VS Code or Azure CLI for deployment.

### Pre-deployment Checklist

1. Set all required environment variables in Azure
2. Configure CORS settings for your frontend domain
3. Run `npm run deploy:prepare` to verify build
4. Test authentication flow with production client codes

## Security Considerations

- **JWT Tokens**: 12-hour expiration for security
- **Environment Variables**: Store sensitive data (JWT_SECRET, client configs) securely
- **CORS**: Configure specific origins in production (avoid wildcard *)
- **Client Codes**: Use secure, random codes for client authentication
- **Token Verification**: All protected endpoints verify JWT signatures

## Troubleshooting

### Common Issues

1. **"Missing token" errors**: Ensure Authorization header includes "Bearer " prefix
2. **"Unknown client" errors**: Verify client ID exists in CLIENT_MAP_JSON
3. **CORS errors**: Check CORS_ALLOW_ORIGIN matches your frontend domain
4. **Token expiration**: Tokens expire after 12 hours, re-authenticate as needed

### Logging

The API logs authentication errors and warnings to Azure Functions logs. Check the Azure portal or use local development tools for debugging.