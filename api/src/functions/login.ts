/**
 * ==========================================
 *  Authentication & Login API Endpoint
 * ==========================================
 * 
 * Handls client authentication using secure login codes and
 * issues JWT tokens for subsequent API access. This is the
 * primary authentication mechanism for wholesale clients. please refer to docs of JWT.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";
import { resolveClientIdFromCode, getClientProfile } from "../util/clients";
import { cors, json } from "../util/http";

/**
 * Client Login Endpoint
 * 
 * POST /api/login
 * 
 * Authentication flow:
 * 1. Client provides a login code (unique per client)
 * 2. System validates the code and resolves to client ID
 * 3. Client profile is loaded with business rules
 * 4. JWT token is generated with 2-hour expiration
 * 5. Token and client info returned for session management
 * 
 * Request Body:
 * {
 *   "code": "client-specific-login-code"
 * }
 * 
 * Response:
 * {
 *   "token": "jwt-token-for-api-access",
 *   "clientId": "internal-client-identifier", 
 *   "clientName": "Human-readable client name"
 * }
 */
app.http("login", {
  methods: ["OPTIONS", "POST"],
  authLevel: "anonymous",
  route: "login",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const { code } = (await req.json()) as { code?: string };
      if (!code) return json({ error: "Please enter an access code." }, 400, cors());

      const clientId = resolveClientIdFromCode(code);
      if (!clientId) {
        return json({ error: "Invalid access code. Try again." }, 401, cors());
      }

      const profile = getClientProfile(clientId);
      if (!profile) {
        return json({ error: "Client profile not found." }, 500, cors());
      }

      profile.displayName =
        clientId === "clientA" ? "Client A" :
        clientId === "clientB" ? "Client B" :
        "Unknown Client";

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        ctx.error("JWT_SECRET missing");
        return json({ error: "Server misconfiguration" }, 500, cors());
      }

      const token = jwt.sign({ clientId }, secret, {
        algorithm: "HS256",
        expiresIn: "2h",
      });

      return json(
        { token, clientId, clientName: profile.displayName },
        200,
        cors()
      );

    } catch (e: any) {
      ctx.error("Login error:", e);
      return json({ error: "Unexpected server error." }, 500, cors());
    }
  }
});