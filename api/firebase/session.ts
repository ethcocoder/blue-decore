import type { IncomingMessage, ServerResponse } from "node:http";
import { serialize } from "cookie";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import { getSessionCookieOptions } from "../../server/_core/cookies";
import { sdk } from "../../server/_core/sdk";
import * as db from "../../server/db";
import { isFirebaseAdminEmail, verifyFirebaseIdToken } from "../../server/firebaseAdmin";

type VercelRequest = IncomingMessage & { body?: unknown; protocol?: string };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let payload: unknown = req.body;
  if (typeof req.body === "string") {
    try { payload = JSON.parse(req.body || "{}"); }
    catch { return res.status(400).json({ error: "Request body must be valid JSON" }); }
  }
  const idToken = typeof payload === "object" && payload !== null && "idToken" in payload && typeof payload.idToken === "string" ? payload.idToken : "";
  if (!idToken) return res.status(400).json({ error: "Firebase ID token is required" });

  try {
    const token = await verifyFirebaseIdToken(idToken);
    const email = token.email ?? null;
    const role = isFirebaseAdminEmail(email) ? "admin" : "user";
    const openId = `firebase_${token.uid}`;
    const displayName = token.name ?? email ?? "Firebase user";

    await db.upsertUser({
      openId,
      name: displayName,
      email,
      loginMethod: "firebase",
      role,
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(openId, { name: displayName });
    res.setHeader("Set-Cookie", serialize(COOKIE_NAME, sessionToken, {
      ...getSessionCookieOptions(req as never),
      maxAge: ONE_YEAR_MS / 1000,
    }));
    return res.status(200).json({ success: true, role });
  } catch (error) {
    console.error("[Firebase Auth] Session exchange failed", error);
    return res.status(401).json({ error: "Firebase sign-in could not be verified" });
  }
}
