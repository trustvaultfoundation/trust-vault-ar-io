// Footer for the trustvault.ar.io shopfront. Every product/community/legal link points to the
// full application on trustvault.foundation (this mirror is landing-only).
const FOUNDATION = "https://trustvault.foundation";

const PRODUCT = [
  { href: `${FOUNDATION}/projects`, label: "DePM" },
  { href: `${FOUNDATION}/governance`, label: "Governance" },
  { href: `${FOUNDATION}/whitepaper`, label: "Whitepaper" },
];
const COMMUNITY = [
  { href: `${FOUNDATION}/forum`, label: "Forum" },
  { href: `${FOUNDATION}/help`, label: "Help" },
];
const LEGAL = [{ href: `${FOUNDATION}/terms`, label: "Terms & Privacy" }];

function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="4.2" />
      <path d="M7.2 10.8v6.8" /><path d="M7.2 7.1h.01" />
      <path d="M11 17.6v-6.8m0 2.6a2.6 2.6 0 0 1 5.2 0v4.2" />
    </svg>
  );
}
function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-4.7 1.4-4.7-2.4-6.6-2.9m13.2 5.3v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.4 4.6 4.6 0 0 0-.1-3.4s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.4 0C6.7 1.4 5.6 1.7 5.6 1.7a4.6 4.6 0 0 0-.1 3.4A5 5 0 0 0 4 8.5c0 5 3.1 6.1 6 6.4a3.1 3.1 0 0 0-.9 2.4V21" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto shrink-0 border-t border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-6 py-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* brand */}
          <div className="max-w-xs">
            <a href={FOUNDATION} aria-label="TrustVault" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="TrustVault" className="h-8 w-auto transition-opacity hover:opacity-80" />
            </a>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The all-in-one encrypted workspace — free, end-to-end encrypted, and kept on-chain forever.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://www.linkedin.com/company/trustvaultfoundation" target="_blank" rel="noopener noreferrer" aria-label="TrustVault on LinkedIn" title="LinkedIn" className="inline-flex text-slate-400 transition-colors hover:text-white">
                <LinkedInIcon />
              </a>
              <a href="https://github.com/trustvaultfoundation" target="_blank" rel="noopener noreferrer" aria-label="TrustVault on GitHub" title="GitHub" className="inline-flex text-slate-400 transition-colors hover:text-white">
                <GitHubIcon />
              </a>
            </div>
          </div>

          {/* link groups */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 md:gap-x-14">
            <LinkGroup title="Product" links={PRODUCT} />
            <LinkGroup title="Community" links={COMMUNITY} />
            <LinkGroup title="Company" links={LEGAL} />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-800/60 pt-5 sm:flex-row">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} TrustVault</p>
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-600">
            <span>Free</span><Dot /><span>Encrypted</span><Dot /><span>Permanent</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-slate-700" />;
}

function LinkGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      <ul className="mt-2.5 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-xs text-slate-400 transition-colors hover:text-white">{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
