export function cors() {
  const allowedOrigin =
    process.env.CORS_ALLOW_ORIGIN || "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { status, jsonBody: data, headers: { "Content-Type": "application/json", ...headers } };
}
