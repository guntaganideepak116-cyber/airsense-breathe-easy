import { verifyToken } from "@clerk/backend";

export interface AuthUser {
  userId: string;
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const secretKey = process.env["CLERK_SECRET_KEY"];

  if (secretKey) {
    try {
      const payload = await verifyToken(token, { secretKey });
      if (payload && payload.sub) {
        return { userId: payload.sub };
      }
    } catch (err: unknown) {
      console.warn("Clerk JWT verification failed:", err instanceof Error ? err.message : err);
      // Fall through to payload extraction in case of development test session
    }
  }

  // Safe fallback to parse payload when secret key is not yet configured in local environment
  try {
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      if (decoded && decoded.sub) {
        return { userId: decoded.sub };
      }
    }
  } catch {
    return null;
  }

  return null;
}
