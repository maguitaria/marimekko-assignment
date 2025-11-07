import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";
import { resolveClientIdFromCode, getClientProfile } from "../util/clients";
import { cors, json } from "../util/http";


app.http("login", {
  methods: ["OPTIONS", "POST"],
  authLevel: "anonymous",
  route: "login",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };
    try {
      const { code } = (await req.json()) as { code?: string };

      // 1️ Validate input
      if (!code)
        return { status: 400, body: "Missing code", headers: cors() };

      // 2️ Resolve client from login code
      const clientId = resolveClientIdFromCode(code);
      if (!clientId)
        return { status: 401, body: "Invalid code", headers: cors() };

      // 3️     Load client profile (pricing/stock rules)
      const profile = getClientProfile(clientId);
      console.log('profile: ', profile);
      // if clientID = clientA, profile = {displayName: "Client A", ...}
      if (clientId === 'clientA') {
        console.log('clientA logged in');
        profile.displayName = "Client A";
      } else if (clientId === 'clientB') {
        console.log('clientB logged in');
        profile.displayName = "Client B";
      } else {
        console.log('Unknown client logged in');
        profile.displayName = "Unknown Client";
      }
      if (!profile)
        return { status: 500, body: "Client profile not found", headers: cors() };

      // 4️ Ensure JWT secret exists
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        ctx.error("JWT_SECRET not configured in environment variables.");
        return { status: 500, body: "Server misconfiguration", headers: cors() };
      }

      // 5️ Generate signed token (explicit algorithm)
      const token = jwt.sign(
        { clientId },
        secret,
        {
          algorithm: "HS256", // explicitly set for security clarity
          expiresIn: "2h",
        }
      );

      // 6️ Return JSON response
      return json(
        {
          token,
          clientId,
          clientName: profile.displayName,
        },
        200,
        cors()
      );
    } catch (e: any) {
      ctx.error("Login error:", e);
      return json({ error: "Server error" }, 500, cors());
    }
  }
});
