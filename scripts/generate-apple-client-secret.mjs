// One-off helper for Apple Sign In: Apple doesn't give you a client secret
// directly — you generate a short-lived JWT yourself from your private key.
//
// Usage:
//   npm install jsonwebtoken --no-save
//   node scripts/generate-apple-client-secret.mjs
//
// Fill in the four values below first. Get them from
// https://developer.apple.com/account → Certificates, Identifiers & Profiles:
//   - teamId:      Membership → Team ID
//   - clientId:    your Services ID (e.g. "com.madarasistudio.web")
//   - keyId:       the Key ID shown when you created your "Sign in with Apple" key
//   - privateKey:  contents of the downloaded AuthKey_XXXXXXXXXX.p8 file

import jwt from "jsonwebtoken";
import fs from "fs";

const teamId = "REPLACE_WITH_TEAM_ID";
const clientId = "REPLACE_WITH_SERVICES_ID";
const keyId = "REPLACE_WITH_KEY_ID";
const privateKeyPath = "./AuthKey_REPLACE.p8";

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d", // Apple allows a maximum of 6 months
  issuer: teamId,
  audience: "https://appleid.apple.com",
  subject: clientId,
  keyid: keyId,
});

console.log("\nAPPLE_CLIENT_SECRET=\n" + token + "\n");
console.log("Paste this into your .env.local / Vercel env vars as APPLE_CLIENT_SECRET.");
console.log("It expires in 180 days — set a reminder to regenerate it.");
