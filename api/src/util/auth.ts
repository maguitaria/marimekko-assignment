import jwt from "jsonwebtoken";
import { HttpRequest } from "@azure/functions";
import { isTokenRevoked } from "../functions/logout";

const secret = process.env.JWT_SECRET || "supersecret123";

export interface AuthData {
  clientId: string;
}

export function verifyToken(req: HttpRequest): AuthData | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, secret) as AuthData;
  } catch {
    return null;
  }
}
