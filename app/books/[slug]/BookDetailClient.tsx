'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import BookCover from '@/components/library/BookCover';
import { calculateReadingTime, formatWords } from '@/lib/reading-time';
import { trackEvent } from '@/lib/analytics';
import { Check, ArrowLeft, Heart, Download, FileText } from 'lucide-react';

export default function BookDetailClient({ book }: { book: Book }) {
  const [continueSlug, setContinueSlug] = useState<string | null>(null);
  const [finishedChapters, setFinishedChapters] = useState<Record<string, boolean>>({});

  const chapters = book.chapters || [];
  const totalWords = chapters.reduce((sum, c) => sum + (c.word_count || 0), 0);
  const totalReadingTime = calculateReadingTime(totalWords);
  const firstChapter = chapters[0];

  useEffect(() => {
    // Record book_open analytics event
    trackEvent('book_open', { bookId: book.id });

    // Read continue point
    const saved = localStorage.getItem(`cl_continue_${book.slug}`);
    if (saved) setContinueSlug(saved);

    // Read finished states
    const doneMap: Record<string, boolean> = {};
    chapters.forEach((c) => {
      doneMap[c.slug] = localStorage.getItem(`cl_finished_${book.slug}_${c.slug}`) === 'true';
    });
    setFinishedChapters(doneMap);
  }, [book.slug, chapters]);

  const continueChapter = continueSlug
    ? chapters.find((c) => c.slug === continueSlug) || firstChapter
    : firstChapter;

  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-[13.5px] text-[var(--muted)] hover:text-[var(--text)] transition-colors hover:no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All books
        </Link>
      </div>

      {/* Book Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-12 pb-10 border-b border-[var(--border)]">
        <div className="max-w-[260px] mx-auto md:mx-0 w-full">
          <BookCover
            title={book.title}
            coverStyle={book.cover_url || 'cover-a'}
            className="shadow-[var(--shadow-lg)]"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-serif-title font-normal text-[32px] sm:text-[42px] leading-tight text-[var(--text)] mb-2">
            {book.title}
          </h1>
          <div className="text-[14px] text-[var(--muted)] mb-4">
            by Nana Kwame Dickson ·{' '}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                book.status === 'completed'
                  ? 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
                  : 'bg-[var(--accent-soft)] text-[var(--accent)]'
              }`}
            >
              {book.status === 'completed' ? 'Completed' : 'Ongoing'}
            </span>
          </div>

          <p className="text-[16.5px] leading-relaxed text-[var(--text)] max-w-xl mb-6">
            {book.synopsis}
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 text-[13.5px] text-[var(--muted)] pb-5 mb-5 border-b border-[var(--border)]">
            <span>
              <strong className="text-[var(--text)]">{chapters.length}</strong> chapters
            </span>
            <span>
              <strong className="text-[var(--text)]">{formatWords(totalWords)}</strong> words
            </span>
            <span>
              <strong className="text-[var(--text)]">{totalReadingTime}</strong> min total
            </span>
            <span>
              <strong className="text-[var(--text)]">1.2k</strong> reads
            </span>
          </div>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {book.tags.map((t) => (
                <span
                  key={t}
                  className="text-[12px] px-2.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {continueSlug && continueChapter ? (
              <>
                <Link
                  href={`/books/${book.slug}/${continueChapter.slug}`}
                  className="px-5 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14.5px] hover:brightness-105 transition-all hover:no-underline"
                >
                  Continue · Ch. {continueChapter.number}
                </Link>
                {firstChapter && (
                  <Link
                    href={`/books/${book.slug}/${firstChapter.slug}`}
                    className="px-4 py-2.5 rounded border border-[var(--border)] text-[var(--text)] text-[14.5px] hover:border-[var(--text)] transition-colors hover:no-underline"
                  >
                    Start over
                  </Link>
                )}
              </>
            ) : firstChapter ? (
              <Link
                href={`/books/${book.slug}/${firstChapter.slug}`}
                className="px-5 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14.5px] hover:brightness-105 transition-all hover:no-underline"
              >
                Start reading
              </Link>
            ) : null}

            <Link
              href="/support"
              className="px-4 py-2.5 rounded border border-[var(--border)] text-[var(--text)] text-[14.5px] hover:border-[var(--text)] transition-colors hover:no-underline flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-[var(--accent)]" /> Support author
            </Link>

            <div className="relative group inline-block">
              <button
                type="button"
                className="px-4 py-2.5 rounded border border-[var(--border)] text-[var(--text)] text-[14.5px] hover:border-[var(--text)] transition-colors flex items-center gap-1.5"
                title="Download full book for offline reading"
              >
                <Download className="w-4 h-4 text-[var(--muted)]" /> Download offline
              </button>
              <div className="absolute left-0 mt-1 hidden group-hover:flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded shadow-lg py-1 z-20 min-w-[180px]">
                <a
                  href={`/api/books/${book.slug}/export?format=html`}
                  download
                  className="px-3.5 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2 hover:no-underline"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--accent)]" /> Standalone HTML
                </a>
                <a
                  href={`/api/books/${book.slug}/export?format=markdown`}
                  download
                  className="px-3.5 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--bg)] flex items-center gap-2 hover:no-underline"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--muted)]" /> Clean Markdown
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter List */}
      <section className="py-10">
        <h2 className="font-serif-title font-medium text-[24px] text-[var(--text)] mb-6">
          Chapters
        </h2>
        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {chapters.map((c) => {
            const isDone = finishedChapters[c.slug];
            return (
              <li key={c.id}>
                <Link
                  href={`/books/${book.slug}/${c.slug}`}
                  className="group flex items-center justify-between py-4 hover:pl-2 transition-all hover:no-underline"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif-title text-[14.5px] text-[var(--muted)] min-w-[28px]">
                      {String(c.number).padStart(2, '0')}
                    </span>
                    <span className="text-[16px] font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {c.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[13px] text-[var(--muted)]">
                    <span>{calculateReadingTime(c.word_count)} min</span>
                    <span className="hidden sm:inline">{formatWords(c.word_count)} words</span>
                    <span
                      className={`w-5 h-5 rounded-full border border-[var(--border)] flex items-center justify-center transition-colors ${
                        isDone ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-contrast)]' : ''
                      }`}
                    >
                      {isDone && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Follow this book */}
      <section className="mt-8 p-8 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] text-center max-w-xl mx-auto shadow-[var(--shadow)]">
        <h3 className="font-serif-title font-medium text-[20px] text-[var(--text)] mb-2">
          Follow <em>{book.title}</em>
        </h3>
        <p className="text-[14px] text-[var(--muted)] mb-5">
          Receive an email the moment a new chapter of this book is published.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          action="/api/subscribe"
          method="POST"
        >
          <input type="hidden" name="book_id" value={book.id} />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
            className="flex-1 px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14px] hover:brightness-105 transition-all"
          >
            Follow
          </button>
        </form>
      </section>
    </div>
  );
}
