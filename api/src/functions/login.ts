import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { resolveClientIdFromCode, getClientProfile, signToken } from "../util";

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "login",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await req.json() as { code?: string };
      const { code } = body;
      if (!code) return { status: 400, body: "Missing code" };

      const clientId = resolveClientIdFromCode(String(code));
      if (!clientId) return { status: 401, body: "Invalid code" };

      const profile = getClientProfile(clientId);
      if (!profile) return { status: 500, body: "Client profile not found" };

      const token = signToken(clientId);
      return json({ token, clientId, clientName: profile.name }, 200, cors());
    } catch (e: any) {
      ctx.error(e);
      return { status: 500, body: "Server error" };
    }
  }
});

function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { status, jsonBody: data, headers: { "Content-Type": "application/json", ...headers } };
}

function cors() {
  const origin = process.env.CORS_ALLOW_ORIGIN || "*";
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}
