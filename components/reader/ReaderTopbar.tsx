'use client';

import Link from 'next/link';
import { Book, Chapter } from '@/lib/types';
import { List, Type } from 'lucide-react';

interface ReaderTopbarProps {
  book: Book;
  chapter: Chapter;
  progressPercent: number;
  isHidden: boolean;
  onOpenSettings: () => void;
  onOpenDrawer: () => void;
}

export default function ReaderTopbar({
  book,
  chapter,
  progressPercent,
  isHidden,
  onOpenSettings,
  onOpenDrawer,
}: ReaderTopbarProps) {
  return (
    <div
      className={`sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-[900px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13.5px] text-[var(--muted)] truncate">
          <Link
            href={`/books/${book.slug}`}
            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors hover:no-underline font-medium"
          >
            {book.title}
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-[var(--text)] font-semibold truncate">
            Ch. {chapter.number}. {chapter.title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[12px] font-mono text-[var(--muted)] min-w-[32px] text-right tabular-nums hidden sm:inline-block">
            {progressPercent}%
          </span>
          <button
            onClick={onOpenDrawer}
            aria-label="Table of contents"
            title="Chapters"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Typography settings"
            title="Settings (Aa)"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reading Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
