import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";
import { resolveClientIdFromCode, getClientProfile } from "../util/clients";

function cors() {
  const origin = process.env.CORS_ALLOW_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { status, jsonBody: data, headers: { "Content-Type": "application/json", ...headers } };
}

app.http("login", {
  methods: ["OPTIONS", "POST"],
  authLevel: "anonymous",
  route: "login",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const { code } = (await req.json()) as { code?: string };
      if (!code) return { status: 400, body: "Missing code", headers: cors() };

      const clientId = resolveClientIdFromCode(code);
      if (!clientId) return { status: 401, body: "Invalid code", headers: cors() };

      const profile = getClientProfile(clientId);
      if (!profile) return { status: 500, body: "Client profile not found", headers: cors() };

      const token = jwt.sign({ clientId }, process.env.JWT_SECRET as string, { expiresIn: "2h" });

      return json({ token, clientId, clientName: profile.name }, 200, cors());
    } catch (e: any) {
      ctx.error(e);
      return { status: 500, body: "Server error", headers: cors() };
    }
  }
});
