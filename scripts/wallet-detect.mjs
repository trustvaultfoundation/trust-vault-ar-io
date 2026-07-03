// Detect a wallet key in any common format and prepare ./wallet.json for the deploy.
// Reads DEPLOY_WALLET_JWK first (if the deploy wallet differs), then PLATFORM_WALLET_JWK,
// from the process env or .env.local / .env.
//
// Recognizes (and writes ./wallet.json in the form that signer needs):
//   • Arweave keyfile — JSON, or base64/base64url of it            → sig "arweave"  (JWK)
//   • EVM private key — 0x-hex / 64-hex                            → sig "ethereum" (hex)
//   • Solana key — base58 (Backpack export), JSON byte array, or   → sig "solana"   (64-byte array)
//     base64/hex of the 64-byte secret (or a 32-byte seed)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import crypto from "node:crypto";

function fromEnvFiles(name) {
  for (const f of [".env.local", ".env"]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*(.*)$`, "m"));
    if (m) { let v = m[1].trim(); if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1); if (v) return v; }
  }
  return "";
}
const readVar = (name) => (process.env[name] && process.env[name].trim()) || fromEnvFiles(name);

function asJwk(s) {
  const parse = (t) => { try { const o = JSON.parse(t); return o && o.kty === "RSA" && typeof o.n === "string" ? o : null; } catch { return null; } };
  let o = parse(s); if (o) return o;
  try { o = parse(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")); } catch {}
  return o || null;
}
function b58decode(s) {
  const A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(s)) return null;
  const bytes = [0];
  for (const ch of s) { let carry = A.indexOf(ch); for (let j = 0; j < bytes.length; j++) { carry += bytes[j] * 58; bytes[j] = carry & 0xff; carry >>= 8; } while (carry) { bytes.push(carry & 0xff); carry >>= 8; } }
  for (const ch of s) { if (ch === "1") bytes.push(0); else break; }
  return Buffer.from(bytes.reverse());
}
function b64decode(s) { if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(s)) return null; try { const b = Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64"); return b.length ? b : null; } catch { return null; } }
function b58encode(buf) {
  const A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const digits = [0];
  for (const byte of buf) { let carry = byte; for (let j = 0; j < digits.length; j++) { carry += digits[j] << 8; digits[j] = carry % 58; carry = (carry / 58) | 0; } while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0; } }
  let str = ""; for (const b of buf) { if (b === 0) str += "1"; else break; }
  for (let k = digits.length - 1; k >= 0; k--) str += A[digits[k]];
  return str;
}
// ed25519: a 32-byte seed → the 64-byte Solana secret key (seed || raw public key).
function solana64FromSeed(seed) {
  const pkcs8 = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
  const priv = crypto.createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
  const spki = crypto.createPublicKey(priv).export({ format: "der", type: "spki" });
  return Buffer.concat([seed, spki.subarray(spki.length - 32)]);
}
// Any Solana key material → Buffer(64) secret key, or null.
function solana64(raw) {
  // JSON array of numbers
  try { const a = JSON.parse(raw); if (Array.isArray(a) && (a.length === 64 || a.length === 32)) { const b = Buffer.from(a); return b.length === 32 ? solana64FromSeed(b) : b; } } catch {}
  for (const b of [b58decode(raw), b64decode(raw)]) {
    if (!b) continue;
    if (b.length === 64) return b;
    if (b.length === 32) { try { return solana64FromSeed(b); } catch { return null; } }
  }
  return null;
}

export function detect() {
  const raw0 = readVar("DEPLOY_WALLET_JWK") || readVar("PLATFORM_WALLET_JWK");
  const source = readVar("DEPLOY_WALLET_JWK") ? "DEPLOY_WALLET_JWK" : "PLATFORM_WALLET_JWK";
  const override = (readVar("DEPLOY_SIG_TYPE") || "").toLowerCase();
  if (!raw0) return { ok: false, message: "No DEPLOY_WALLET_JWK or PLATFORM_WALLET_JWK found (checked env, .env.local, .env)." };
  const raw = raw0.trim();

  // 1) Arweave keyfile
  const jwk = asJwk(raw);
  if (jwk) { writeFileSync("wallet.json", JSON.stringify(jwk)); return { ok: true, sigType: "arweave", message: `✓ ${source}: Arweave keyfile (JWK) → ./wallet.json. Signing as arweave.` }; }

  // 2) explicit EVM, or 0x/64-hex
  const hex = raw.replace(/^0x/i, "");
  if ((override === "ethereum" || override === "polygon") && /^[0-9a-fA-F]{64}$/.test(hex)) { writeFileSync("wallet.json", "0x" + hex.toLowerCase()); return { ok: true, sigType: override, message: `✓ ${source}: EVM private key → ./wallet.json. Signing as ${override}.` }; }
  if (/^[0-9a-fA-F]{64}$/.test(hex) && override !== "solana") { writeFileSync("wallet.json", "0x" + hex.toLowerCase()); return { ok: true, sigType: "ethereum", message: `✓ ${source}: 32-byte EVM private key (hex) → ./wallet.json. Signing as ethereum.` }; }

  // 3) Solana (base58 / JSON array / base64 of 32 or 64 bytes)
  const sol = solana64(raw);
  if (sol) {
    writeFileSync("wallet.json", JSON.stringify([...sol]));
    const address = b58encode(sol.subarray(32, 64));
    return { ok: true, sigType: "solana", address, message: `✓ ${source}: Solana key → ./wallet.json (64-byte secret).\n   Derived wallet address: ${address}\n   → Confirm this is your Backpack address (and the owner of trustvault on arns.app) before deploying.` };
  }

  // 4) couldn't make a full key
  const bytes = b64decode(raw) || b58decode(raw);
  if (bytes) return { ok: false, solana: true, message: `✗ ${source}: a ${bytes.length}-byte value — not a full key. A Solana wallet's private key is 64 bytes; export the proper key from Backpack (Settings → Show Private Key) and put it here.` };
  return { ok: false, message: `✗ ${source}: unrecognized key format (not JWK, hex, base58, base64, or byte array).` };
}

export const SOLANA_INFO =
  "Deploying with a Solana-owned ArNS name (permaweb-deploy can't sign Solana, so this uses\n" +
  "Turbo + ArNS directly):\n" +
  "  1) npm run deploy   builds ./out and uploads it to Arweave via Turbo, paying on-demand\n" +
  "     with SOL (your wallet needs a little SOL). It prints the MANIFEST transaction id.\n" +
  "  2) Point the name: open https://arns.app, connect Backpack, edit `trustvault`, and set\n" +
  "     its target (undername @) to that manifest id.\n";
