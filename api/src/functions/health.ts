/**
 * ==========================================
 *  Health Check API Endpoint
 * ==========================================
 * 
 * Provides system health status and diagnostic information
 * for monitoring and operational purposes.
 */

import { app } from "@azure/functions";
import { cors, json } from "../util/http";

/**
 * Health Check Endpoint
 * 
 * GET /api/health
 * 
 * Returns basic system health information including:
 * - Service status (ok/error)
 * - API version information
 * - Current timestamp
 * - System uptime
 * 
 * This endpoint is publicly accessible (no authentication required)
 * and is typically used by load balancers, monitoring systems,
 * and deployment pipelines to verify service availability.
 */
app.http("health", {
  route: "health",
  methods: ["GET"],
  authLevel: "anonymous", // Public endpoint - no authentication required
  handler: async () => {
    // Return system health information
    return json(
      {
        status: "ok",                           // Service status indicator
        version: "v1.0.0",                     // API version
        timestamp: new Date().toISOString(),   // Current server time (ISO format)
        uptime: process.uptime().toFixed(2),   // Process uptime in seconds
      },
      200,        // HTTP 200 OK status
      cors()      // Include CORS headers for browser requests
    );
  },
});
