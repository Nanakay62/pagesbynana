'use client';

import Link from 'next/link';
import { Chapter } from '@/lib/types';
import { calculateReadingTime } from '@/lib/reading-time';
import { X, Check } from 'lucide-react';

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookSlug: string;
  chapters: Chapter[];
  currentChapterId: string;
}

export default function ChapterDrawer({
  isOpen,
  onClose,
  bookTitle,
  bookSlug,
  chapters,
  currentChapterId,
}: ChapterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--border)] h-full flex flex-col shadow-[var(--shadow-lg)] z-10 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Table of Contents
            </div>
            <h3 className="font-serif-title font-medium text-[17px] text-[var(--text)] truncate max-w-[200px]">
              {bookTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg)] transition-colors"
            aria-label="Close chapter drawer"
          >
            <X className="w-4 h-4 text-[var(--muted)]" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-[var(--border)] mt-2">
          {chapters.map((chap) => {
            const isCurrent = chap.id === currentChapterId;
            let isDone = false;
            if (typeof window !== 'undefined') {
              isDone = localStorage.getItem(`cl_finished_${bookSlug}_${chap.slug}`) === 'true';
            }

            return (
              <li key={chap.id}>
                <Link
                  href={`/books/${bookSlug}/${chap.slug}`}
                  onClick={onClose}
                  className={`flex items-center justify-between py-3 px-1 hover:bg-[var(--bg)] rounded transition-colors hover:no-underline ${
                    isCurrent ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif-title text-[13px] text-[var(--muted)] min-w-[20px]">
                      {chap.number}
                    </span>
                    <div>
                      <div className="text-[14.5px] leading-tight">{chap.title}</div>
                      <div className="text-[12px] text-[var(--muted)] mt-0.5">
                        {calculateReadingTime(chap.word_count)} min read
                      </div>
                    </div>
                  </div>
                  {isDone && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
