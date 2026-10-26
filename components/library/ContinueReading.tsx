'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { calculateReadingTime } from '@/lib/reading-time';
import { Bookmark } from 'lucide-react';

export default function ContinueReading({ books }: { books: Book[] }) {
  const [items, setItems] = useState<
    Array<{ book: Book; chapter: NonNullable<Book['chapters']>[0] }>
  >([]);

  useEffect(() => {
    const active: Array<{ book: Book; chapter: NonNullable<Book['chapters']>[0] }> = [];
    books.forEach((book) => {
      const savedChapSlug = localStorage.getItem(`cl_continue_${book.slug}`);
      if (savedChapSlug && book.chapters) {
        const found = book.chapters.find((c) => c.slug === savedChapSlug);
        if (found) {
          active.push({ book, chapter: found });
        }
      }
    });
    setItems(active);
  }, [books]);

  if (items.length === 0) return null;

  return (
    <section className="mt-12 mb-10">
      <div className="flex items-center gap-2 text-[12px] tracking-wider uppercase font-semibold text-[var(--muted)] mb-3">
        <Bookmark className="w-3.5 h-3.5 text-[var(--accent)]" />
        Continue reading
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {items.map(({ book, chapter }) => (
          <Link
            key={book.id}
            href={`/books/${book.slug}/${chapter.slug}`}
            className="flex-shrink-0 w-64 p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:no-underline"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] truncate">
              {book.title}
            </div>
            <div className="font-serif-title font-medium text-[16px] text-[var(--text)] mt-1.5 truncate">
              {chapter.title}
            </div>
            <div className="text-[12px] text-[var(--muted)] mt-2">
              Chapter {chapter.number} · {calculateReadingTime(chapter.word_count)} min read
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
