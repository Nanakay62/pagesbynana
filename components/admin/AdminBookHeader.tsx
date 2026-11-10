'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import BookCover from '@/components/library/BookCover';
import EditBookModal from './EditBookModal';
import { Plus, Settings } from 'lucide-react';

export default function AdminBookHeader({ book }: { book: Book }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const chapters = book.chapters || [];

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)]">
        <div className="flex items-start gap-5">
          <div className="w-[72px] flex-shrink-0">
            <BookCover
              title={book.title}
              coverStyle={book.cover_url}
              className="shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
                {book.title}
              </h1>
              {book.is_featured && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-semibold">
                  Featured
                </span>
              )}
            </div>
            <div className="text-[13.5px] text-[var(--muted)]">
              {book.genre || 'Uncategorized'} · <span className="capitalize">{book.status}</span> · {chapters.length} chapters
            </div>
            {book.synopsis && (
              <p className="text-[13px] text-[var(--muted)] mt-2 max-w-xl line-clamp-2">
                {book.synopsis}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[var(--accent)]" /> Edit Book & Cover
          </button>
          <a
            href={`/api/books/${book.slug}/export?format=markdown`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            Export .md
          </a>
          <a
            href={`/api/books/${book.slug}/export?format=html`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            Export .html
          </a>
          <Link
            href={`/admin/chapters/new?book_id=${book.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all hover:no-underline"
          >
            <Plus className="w-4 h-4" /> New chapter
          </Link>
        </div>
      </div>

      <EditBookModal
        book={book}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}

