/**
 * ==========================================
 *  API Homepage & Documentation Endpoint
 * ==========================================
 * 
 * Serves as the main entry point and documentation page for
 * the Marimekko Wholesale API. Provides an overview of
 * available endpoints and system status information.
 */

import { app } from "@azure/functions";

/**
 * API Homepage Endpoint
 * 
 * GET /api (root endpoint)
 * 
 * Returns an HTML documentation page that serves as:
 * - API discovery interface showing available endpoints
 * - System status verification (if this loads, API is working)
 * - Basic documentation for developers
 * - Human-readable overview of the API structure
 * 
 * This endpoint is publicly accessible and provides a user-friendly
 * way to explore the API without requiring specialized tools.
 * 
 * Features:
 * - Clean HTML interface with embedded CSS
 * - Clickable links to test API endpoints
 * - Technology stack information
 * - Responsive design for various devices
 */
app.http("index", {
  methods: ["GET"],
  authLevel: "anonymous", // Public documentation endpoint
  route: "",              // Root route (/api)
  handler: async (request, context) => {
    return {
      status: 200,
      headers: { "Content-Type": "text/html" }, // Return HTML content
      body: `
      <html>
        <head>
          <title>Client Store API</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #fafafa; }
            h1 { color: #333; }
            a { display:block; margin: 6px 0; color: #0066cc; }
          </style>
        </head>
        <body>
          <h1> Client Store API is Running</h1>
          <p>This API powers the storefront experience for different clients.</p>

          <h3> Available Endpoints</h3>
          <!-- Direct links for easy testing and exploration -->
          <a href="/api/products">/api/products - Get client-specific product catalog</a>
          <a href="/api/profile">/api/profile - Get client profile information</a>
          <a href="/api/clients">/api/clients - List all available clients</a>
          <a href="/api/health">/api/health - System health check</a>
          <a href="/api/hello">/api/hello - Simple test endpoint</a>

          <h3> Authentication Endpoints</h3>
          <p style="margin-left: 20px; color: #666;">
            POST /api/login - Client authentication<br>
            POST /api/logout - Session termination
          </p>

          <p style="margin-top:20px;opacity:0.6;">
             Backend: Azure Functions •  Frontend: Azure Static Web Apps
          </p>
        </body>
      </html>
      `
    };
  }
});
