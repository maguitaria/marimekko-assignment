import { app } from "@azure/functions";

app.http("index", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "",
  handler: async (request, context) => {
    return {
      status: 200,
      headers: { "Content-Type": "text/html" },
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

          <h3>Available Endpoints</h3>
          <a href="/api/products">/api/products</a>
          <a href="/api/stock">/api/stock</a>
          <a href="/api/client">/api/client</a>

          <p style="margin-top:20px;opacity:0.6;">
            Backend: Azure Functions • Frontend: Azure Static Web Apps
          </p>
        </body>
      </html>
      `
    };
  }
});
