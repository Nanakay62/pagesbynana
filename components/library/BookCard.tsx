import Link from 'next/link';
import { Book } from '@/lib/types';
import BookCover from './BookCover';
import { formatWords } from '@/lib/reading-time';

export default function BookCard({ book }: { book: Book }) {
  const chapterCount = book.chapters ? book.chapters.length : 0;
  const totalWords = book.chapters
    ? book.chapters.reduce((sum, c) => sum + (c.word_count || 0), 0)
    : 0;

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col hover:no-underline transition-transform"
    >
      <div className="w-full mb-3 rounded shadow-[var(--shadow)] group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lg)] transition-all">
        <BookCover
          title={book.title}
          coverStyle={book.cover_url || 'cover-a'}
        />
      </div>
      <h3 className="font-serif-title font-medium text-[17px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
        {book.title}
      </h3>
      <div className="flex items-center gap-2 text-[12.5px] text-[var(--muted)]">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide ${
            book.status === 'completed'
              ? 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
              : 'bg-[var(--accent-soft)] text-[var(--accent)]'
          }`}
        >
          {book.status === 'completed' ? 'Completed' : 'Ongoing'}
        </span>
        <span>
          {chapterCount} chap{chapterCount !== 1 ? 's' : ''} · {formatWords(totalWords)} w
        </span>
      </div>
    </Link>
  );
}
