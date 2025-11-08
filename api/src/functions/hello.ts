/**
 * ==========================================
 * Hello World API Endpoint
 * ==========================================
 * 
 * Simple test endpoint to verify Azure Functions deployment
 * and basic API functionality. Used for development testing
 * and deployment verification.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Basic hello world handler function.
 * 
 * This is a simple test function that returns a greeting message
 * to verify that the Azure Functions runtime is working correctly.
 * 
 * @param req - The HTTP request object (unused in this simple example)
 * @param ctx - The invocation context for logging and diagnostics
 * @returns A simple HTTP response with a greeting message
 */
export async function helloHandler(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  return { body: "Hello from Azure Functions!" };
}

/**
 * Hello World Endpoint
 * 
 * GET /api/hello
 * 
 * Simple endpoint that returns a greeting message.
 * Used for:
 * - Testing Azure Functions deployment
 * - Verifying API gateway connectivity
 * - Development environment validation
 * - Health check alternative
 * 
 * No authentication required - public test endpoint.
 */
app.http("hello", {
  methods: ["GET"],
  authLevel: "anonymous", // Public test endpoint
  handler: helloHandler,
});
