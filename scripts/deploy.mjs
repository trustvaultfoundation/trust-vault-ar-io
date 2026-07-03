// One-shot deploy of the trustvault.ar.io shopfront: detect the wallet key → write
// ./wallet.json → static build → publish to Arweave and repoint the `trustvault` ArNS name.
//   • Arweave / EVM key → permaweb-deploy (uploads + repoints the ArNS name).
//   • Solana key        → Turbo upload (pays SOL on-demand) → finish the 1-click ArNS
//                         repoint on arns.app (permaweb-deploy has no Solana signer).
import { execSync } from "node:child_process";
import { detect, SOLANA_INFO } from "./wallet-detect.mjs";

const r = detect();
console.log(r.message);
if (!r.ok) { if (r.solana) console.error("\n" + SOLANA_INFO); process.exit(1); }

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const fail = (msg, e) => { console.error("\n" + msg); process.exit(typeof e?.status === "number" ? e.status : 1); };

try { run("node scripts/build-static.mjs"); } catch (e) { fail("✗ Static build failed.", e); }

if (r.sigType === "solana") {
  console.log("\nUploading ./out to Arweave via Turbo (Solana; pays SOL on-demand)…");
  const cmd = "npx -y @ardrive/turbo-sdk@latest --token solana upload-folder"
    + " --folder-path ./out --index-file index.html --fallback-file 404.html --wallet-file ./wallet.json"
    + " --on-demand --show-progress --max-concurrency 1";
  const ATTEMPTS = 3;
  let uploaded = false;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try { run(cmd); uploaded = true; break; }
    catch {
      console.error(`\n↻ Upload attempt ${attempt}/${ATTEMPTS} hit Turbo errors (its gateway is intermittently 504-ing).`);
      if (attempt < ATTEMPTS) { console.error("  waiting 12s, then retrying the whole folder…"); await new Promise((res) => setTimeout(res, 12000)); }
    }
  }
  if (!uploaded) {
    console.error("\n✗ Turbo upload didn't complete after " + ATTEMPTS + " tries — its endpoint is degraded right now.");
    console.error("  Wait a while and run `npm run deploy` again — off-peak tends to go through.");
    process.exit(1);
  }
  console.log("\n✓ Uploaded. Copy the MANIFEST transaction id printed above.");
  console.log("Finish the deploy: open https://arns.app, connect Backpack, edit `trustvault`,");
  console.log("and set its target (undername @) to that manifest id. One click and you're live.");
} else {
  try {
    run(`npx -y permaweb-deploy deploy --sig-type ${r.sigType} --use-arns --arns-name trustvault --deploy-folder ./out --wallet ./wallet.json`);
  } catch (e) { fail("✗ permaweb-deploy failed.", e); }
  console.log("\n✓ Done. https://trustvault.ar.io/ will serve the new build shortly.");
}
