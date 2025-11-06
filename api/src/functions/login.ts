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
      if (!code) return { status: 400, body: "Missing code", headers: cors() };

      const clientId = resolveClientIdFromCode(code);
      if (!clientId) return { status: 401, body: "Invalid code", headers: cors() };

      const profile = getClientProfile(clientId);
      if (!profile) return { status: 500, body: "Client profile not found", headers: cors() };

      const token = jwt.sign({ clientId }, process.env.JWT_SECRET as string, { expiresIn: "2h" });

      return json({ token, clientId, clientName: profile.name }, 200, cors());
    } catch (e: any) {
      ctx.error(e);
      return json({ error: "Server error" }, 500, cors());
    }
  }
});
