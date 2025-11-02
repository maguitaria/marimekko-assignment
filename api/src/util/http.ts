export function cors() {
  const origin = process.env.CORS_ALLOW_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

export function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { status, jsonBody: data, headers: { "Content-Type": "application/json", ...headers } };
}
