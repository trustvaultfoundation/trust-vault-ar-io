<div align="center">

# TrustVault — ar.io shopfront

The **landing page** served at [trustvault.ar.io](https://trustvault.ar.io).

</div>

---

This is a small, standalone site: a single marketing landing page that mirrors the design of the
main app and funnels every call to action to the full application on
**[trustvault.foundation](https://trustvault.foundation)**.

It exists so the permaweb (Arweave / ArNS) copy stays fast and cheap to publish, while the full,
wallet-gated app lives on the primary Cloudflare-hosted domain.

- **No wallet, no crypto, no app routes** — just the landing page. Every "Sign in" / "Get started"
  and footer link opens `trustvault.foundation`.
- The full application lives in the sibling **`../trust-vault`** folder.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

## Build & deploy to Arweave / ArNS

```bash
npm run build:static   # static export → ./out
npm run prepare-wallet # (optional) verify your deploy key is detected
npm run deploy         # build + publish + repoint the `trustvault` ArNS name
```

`npm run deploy` reads `DEPLOY_WALLET_JWK` (or `PLATFORM_WALLET_JWK`) from `.env.local` / `.env` —
see [`.env.example`](.env.example). It supports Arweave, EVM and Solana keys. **Never commit the
wallet key.**

## License

Business Source License 1.1 (BUSL-1.1) — see the main [`../trust-vault`](../trust-vault) repository.
Copyright © 2026 TrustVault.
