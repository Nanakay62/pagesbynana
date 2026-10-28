import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 mt-auto text-[var(--muted)] text-[13.5px]">
      <div className="max-w-[1100px] mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          © 2026 Pages by Nana · Original fiction, quietly told.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors hover:no-underline">
            About
          </Link>
          <Link href="/support" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors hover:no-underline">
            Support
          </Link>
          <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors hover:no-underline">
            Privacy
          </Link>
          <span className="text-[var(--muted)] opacity-60">
            RSS
          </span>
        </div>
      </div>
    </footer>
  );
}
