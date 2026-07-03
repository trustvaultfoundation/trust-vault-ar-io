// Detect the wallet key format and (for deployable types) write ./wallet.json.
// Run on its own to check what you have: `npm run prepare-wallet`.
import { detect, SOLANA_INFO } from "./wallet-detect.mjs";

const r = detect();
console.log(r.message);
if (!r.ok) {
  if (r.solana) console.error("\n" + SOLANA_INFO);
  process.exit(1);
}
if (r.sigType === "solana") console.log("\n" + SOLANA_INFO);
else console.log(`Next: npm run deploy   (uses --sig-type ${r.sigType})`);
