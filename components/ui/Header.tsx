'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sun, Moon, Coffee } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('cl_theme') || 'light';
    setTheme(saved);
  }, []);

  const cycleTheme = () => {
    const cycle: Record<string, string> = {
      light: 'sepia',
      sepia: 'dark',
      dark: 'auto',
      auto: 'light',
    };
    const next = cycle[theme] || 'light';
    let effective = next;
    if (next === 'auto') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effective);
    localStorage.setItem('cl_theme', next);
    setTheme(next);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md transition-colors">
      <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-serif-title font-medium text-[22px] tracking-tight text-[var(--text)] flex items-center gap-2 hover:no-underline"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block"></span>
            Pages by Nana
          </Link>
          <nav className="hidden sm:flex items-center gap-1" aria-label="Primary">
            <Link
              href="/books"
              className={`px-3 py-1.5 rounded text-[14.5px] font-medium transition-colors hover:no-underline ${
                pathname.startsWith('/books')
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              Library
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded text-[14.5px] font-medium transition-colors hover:no-underline ${
                pathname === '/about'
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              About
            </Link>
            <Link
              href="/support"
              className={`px-3 py-1.5 rounded text-[14.5px] font-medium transition-colors hover:no-underline flex items-center gap-1.5 ${
                pathname === '/support'
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-[var(--accent)]" />
              Support
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-[13px] px-2.5 py-1 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors hover:no-underline"
          >
            Admin
          </Link>
          <button
            onClick={cycleTheme}
            aria-label="Toggle visual theme"
            title="Theme (Light / Sepia / Dark / Auto) [T]"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)] border border-[var(--border)] bg-[var(--surface)] hover:filter hover:brightness-95 transition-all"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
