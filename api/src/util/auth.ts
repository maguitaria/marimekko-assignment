/**
 * ==========================================
 *  Authentication & JWT Token Management
 * ==========================================
 * 
 * This module handles JWT token verification and authentication for the
 * Marimekko wholesale API. It provides secure token validation for
 * client authentication and authorization.
 */

import jwt from "jsonwebtoken";
import { HttpRequest } from "@azure/functions";
import { isTokenRevoked } from "../functions/logout";

// JWT secret key - retrieved from environment variables for security
// Falls back to default for development (should be set in production)
const secret = process.env.JWT_SECRET || "supersecret123";

/**
 * Authentication data extracted from JWT tokens
 * Contains the essential client identification information
 */
export interface AuthData {
  /** Unique identifier for the authenticated client */
  clientId: string;
}

/**
 * Verifies and extracts authentication data from HTTP request headers.
 * 
 * This function:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Validates the JWT signature using the secret key
 * 3. Returns the decoded client information if valid
 * 
 * @param req - The incoming HTTP request containing authorization headers
 * @returns The decoded authentication data if token is valid, null otherwise
 * 
 * @example
 * ```typescript
 * const authData = verifyToken(request);
 * if (authData) {
 *   console.log(`Authenticated client: ${authData.clientId}`);
 * }
 * ```
 */
export function verifyToken(req: HttpRequest): AuthData | null {
  // Extract the Authorization header from the request
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null; // No authorization header provided
  
  // Parse the Bearer token from the header format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return null; // No token found after "Bearer "

  try {
    // Verify the JWT token signature and decode the payload
    // This ensures the token is valid and hasn't been tampered with
    return jwt.verify(token, secret) as AuthData;
  } catch {
    // Token verification failed (invalid signature, expired, malformed, etc.)
    return null;
  }
}
