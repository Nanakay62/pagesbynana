'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, Chapter } from '@/lib/types';
import { calculateReadingTime, formatWords } from '@/lib/reading-time';
import { trackEvent } from '@/lib/analytics';
import ReaderTopbar from './ReaderTopbar';
import ReaderSettings from './ReaderSettings';
import ChapterDrawer from './ChapterDrawer';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';

interface ReaderViewProps {
  book: Book;
  chapter: Chapter;
  cleanHtml: string;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export default function ReaderView({
  book,
  chapter,
  cleanHtml,
  prevChapter,
  nextChapter,
}: ReaderViewProps) {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isTopbarHidden, setIsTopbarHidden] = useState(false);

  const lastScrollY = useRef(0);
  const hasMarkedComplete = useRef(false);

  // Track continuation & restore scroll position
  useEffect(() => {
    // Record chapter_read event
    trackEvent('chapter_read', { bookId: book.id, chapterId: chapter.id });

    localStorage.setItem(`cl_continue_${book.slug}`, chapter.slug);

    const scrollKey = `cl_scroll_${book.slug}_${chapter.slug}`;
    const savedY = parseInt(localStorage.getItem(scrollKey) || '0', 10);
    if (savedY > 0) {
      window.scrollTo(0, savedY);
    }

    const onScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.round((y / docHeight) * 100)) : 0;
      setProgressPercent(pct);

      if (y > lastScrollY.current && y > 120) {
        setIsTopbarHidden(true);
      } else {
        setIsTopbarHidden(false);
      }
      lastScrollY.current = y;

      localStorage.setItem(scrollKey, String(Math.round(y)));

      if (pct > 90 && !hasMarkedComplete.current) {
        hasMarkedComplete.current = true;
        localStorage.setItem(`cl_finished_${book.slug}_${chapter.slug}`, 'true');
        trackEvent('chapter_complete', { bookId: book.id, chapterId: chapter.id });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [book.slug, chapter.slug]);

  // Instant prefetching of next chapter
  useEffect(() => {
    if (nextChapter) {
      router.prefetch(`/books/${book.slug}/${nextChapter.slug}`);
    }
  }, [book.slug, nextChapter, router]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' && nextChapter) {
        router.push(`/books/${book.slug}/${nextChapter.slug}`);
      } else if (e.key === 'ArrowLeft' && prevChapter) {
        router.push(`/books/${book.slug}/${prevChapter.slug}`);
      } else if (e.key === 't' || e.key === 'T') {
        const cur = localStorage.getItem('cl_theme') || 'light';
        const cycle: Record<string, string> = {
          light: 'sepia',
          sepia: 'dark',
          dark: 'auto',
          auto: 'light',
        };
        const next = cycle[cur] || 'light';
        let effective = next;
        if (next === 'auto') {
          effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', effective);
        localStorage.setItem('cl_theme', next);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [book.slug, nextChapter, prevChapter, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <ReaderTopbar
        book={book}
        chapter={chapter}
        progressPercent={progressPercent}
        isHidden={isTopbarHidden}
        onOpenSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      <ReaderSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ChapterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        bookTitle={book.title}
        bookSlug={book.slug}
        chapters={book.chapters || []}
        currentChapterId={chapter.id}
      />

      {/* Reader Text Measure Container (680px centered) */}
      <main className="flex-1 max-w-[680px] w-full mx-auto px-5 pt-12 pb-28">
        <header className="text-center pb-8 mb-8 border-b border-[var(--border)]">
          <div className="text-[12px] uppercase tracking-widest text-[var(--accent)] font-semibold mb-2">
            Chapter {chapter.number}
          </div>
          <h1 className="font-serif-title font-normal text-[32px] sm:text-[40px] leading-tight text-[var(--text)] mb-3">
            {chapter.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-[13.5px] text-[var(--muted)]">
            <span>{formatWords(chapter.word_count)} words</span>
            <span>·</span>
            <span>{calculateReadingTime(chapter.word_count)} min read</span>
            <span>·</span>
            <span>{book.title}</span>
          </div>
        </header>

        {/* Clean reader body */}
        <div
          className="reader-content font-reading-text text-[var(--text)]"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

        {/* Previous / Next Chapter Buttons */}
        <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-[var(--border)]">
          {prevChapter ? (
            <Link
              href={`/books/${book.slug}/${prevChapter.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline text-[14px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="opacity-40 text-[14px] flex items-center gap-2 px-4 py-2">
              <ArrowLeft className="w-4 h-4" /> Previous
            </span>
          )}

          {nextChapter ? (
            <Link
              href={`/books/${book.slug}/${nextChapter.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline text-[14px]"
            >
              <span>Next: {nextChapter.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="opacity-40 text-[14px] flex items-center gap-2 px-4 py-2">
              Next <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* End of Chapter Card */}
        <div className="mt-14 p-7 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] text-center shadow-[var(--shadow)]">
          <div className="font-serif-title text-[22px] text-[var(--accent)] mb-2">❦</div>
          <h3 className="font-serif-title font-medium text-[20px] text-[var(--text)] mb-1">
            End of chapter
          </h3>
          <p className="text-[14.5px] text-[var(--muted)] mb-5">
            You finished <em>{chapter.title}</em>.{' '}
            {nextChapter ? 'The next chapter is ready.' : 'You are all caught up!'}
          </p>

          {nextChapter && (
            <Link
              href={`/books/${book.slug}/${nextChapter.slug}`}
              className="block p-3.5 mb-5 rounded bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] text-left transition-colors hover:no-underline"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Up next
              </div>
              <div className="font-serif-title font-medium text-[16.5px] text-[var(--text)] mt-1">
                Chapter {nextChapter.number} · {nextChapter.title}
              </div>
            </Link>
          )}

          <div className="flex justify-center gap-3 mb-5">
            <Link
              href={`/books/${book.slug}`}
              className="px-4 py-2 rounded text-[13.5px] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg)] transition-colors hover:no-underline"
            >
              All chapters
            </Link>
            <Link
              href="/support"
              onClick={() => trackEvent('donate_click', { bookId: book.id, chapterId: chapter.id })}
              className="px-4 py-2 rounded text-[13.5px] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg)] transition-colors hover:no-underline flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[var(--accent)]" />
              Support Nana
            </Link>
          </div>

          <div className="text-[13px] text-[var(--muted)] pt-4 border-t border-[var(--border)]">
            Reading is completely free. If this chapter stayed with you,{' '}
            <Link
              href="/support"
              onClick={() => trackEvent('donate_click', { bookId: book.id, chapterId: chapter.id })}
              className="text-[var(--accent)] hover:underline"
            >
              consider leaving a tip on Paystack
            </Link>{' '}
            — mobile money and card tips help the next chapter get written.
          </div>
        </div>
      </main>
    </div>
  );
}
