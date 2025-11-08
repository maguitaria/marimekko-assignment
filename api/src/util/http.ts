/**
 * ==========================================
 *  HTTP Response & CORS Utilities
 * ==========================================
 * 
 * This module provides helper functions for handling HTTP responses,
 * CORS (Cross-Origin Resource Sharing) headers, and JSON formatting
 * for Azure Functions API endpoints.
 */

/**
 * Generates CORS headers for cross-origin requests.
 * 
 * Configures the API to accept requests from the frontend application
 * by setting appropriate Access-Control headers. The allowed origin
 * can be configured via environment variables for different environments.
 * 
 * @returns An object containing CORS headers for HTTP responses
 * 
 * @example
 * ```typescript
 * return { 
 *   status: 200, 
 *   body: data, 
 *   headers: cors() 
 * };
 * ```
 */
export function cors() {
  // Get allowed origin from environment variable, default to wildcard for development
  // In production, this should be set to the specific frontend domain for security
  const allowedOrigin =
    process.env.CORS_ALLOW_ORIGIN || "*";

  return {
    // Allow requests from the specified origin (frontend domain)
    "Access-Control-Allow-Origin": allowedOrigin,
    
    // Allow these HTTP methods for API operations
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    
    // Allow these headers in requests (needed for JSON and authentication)
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Creates a standardized JSON response for Azure Functions.
 * 
 * This helper function formats data as JSON and sets appropriate
 * content-type headers, with optional custom headers and status codes.
 * 
 * @param data - The data to be serialized as JSON in the response body
 * @param status - HTTP status code (defaults to 200 for success)
 * @param headers - Additional custom headers to include in the response
 * @returns A formatted HTTP response object for Azure Functions
 * 
 * @example
 * ```typescript
 * // Simple success response
 * return json({ message: "Success" });
 * 
 * // Error response with custom status and CORS
 * return json({ error: "Not found" }, 404, cors());
 * ```
 */
export function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { 
    status,                                           // HTTP status code
    jsonBody: data,                                  // Response data (auto-serialized to JSON)
    headers: { 
      "Content-Type": "application/json",            // Set JSON content type
      ...headers                                     // Merge in any additional headers (like CORS)
    } 
  };
}
