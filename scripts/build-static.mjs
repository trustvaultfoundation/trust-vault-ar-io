// Static export for Arweave/ArNS hosting (trustvault.ar.io).
// The shopfront has no server routes, so this is a plain static `next build` with
// STATIC_EXPORT=1 → ./out.
import { execSync } from "node:child_process";

let code = 0;
try {
  execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC_EXPORT: "1" } });
} catch (e) {
  code = typeof e?.status === "number" ? e.status : 1;
}
process.exit(code);
