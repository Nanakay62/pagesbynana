'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import BookCover from '@/components/library/BookCover';
import { formatWords, calculateReadingTime } from '@/lib/reading-time';
import { Search, ArrowRight, Clock, FileText } from 'lucide-react';

export default function ArticlesClient({ articles }: { articles: Book[] }) {
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.synopsis && a.synopsis.toLowerCase().includes(q)) ||
        (a.genre && a.genre.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [articles, query]);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, topics, or keywords..."
            aria-label="Search articles"
            className="w-full pl-9 pr-4 py-2 text-[14px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="text-[13px] text-[var(--muted)]">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} published
        </div>
      </div>

      {/* Articles List / Grid */}
      {filteredArticles.length > 0 ? (
        <div className="space-y-8">
          {filteredArticles.map((article) => {
            const totalWords = article.chapters
              ? article.chapters.reduce((sum, c) => sum + (c.word_count || 0), 0)
              : 0;
            const readingTime = calculateReadingTime(totalWords);
            const firstChap = article.chapters?.[0];
            const readUrl = firstChap
              ? `/books/${article.slug}/${firstChap.slug}`
              : `/books/${article.slug}`;

            return (
              <article
                key={article.id}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8 p-6 sm:p-8 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] hover:border-[var(--accent)] transition-all group"
              >
                <div className="w-full max-w-[200px] mx-auto md:mx-0">
                  <Link href={readUrl} className="block group-hover:scale-[1.01] transition-transform">
                    <BookCover
                      title={article.title}
                      coverStyle={article.cover_url}
                      className="shadow-md"
                    />
                  </Link>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-[var(--accent-soft)] text-[var(--accent)]">
                        {article.genre || 'Special Report'}
                      </span>
                      <span className="text-[12.5px] text-[var(--muted)]">·</span>
                      <span className="text-[12.5px] text-[var(--muted)] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {readingTime} min read
                      </span>
                    </div>

                    <h2 className="font-serif-title font-medium text-[24px] sm:text-[28px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight mb-2">
                      <Link href={readUrl} className="hover:no-underline text-inherit">
                        {article.title}
                      </Link>
                    </h2>

                    <div className="text-[13px] text-[var(--muted)] mb-4">
                      by Nana Kwame Dickson
                    </div>

                    {article.synopsis && (
                      <p className="text-[15px] leading-relaxed text-[var(--text)] opacity-90 max-w-2xl mb-6">
                        {article.synopsis}
                      </p>
                    )}

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {article.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[11.5px] px-2.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                    <Link
                      href={readUrl}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13.5px] font-medium hover:brightness-105 transition-all hover:no-underline"
                    >
                      <FileText className="w-4 h-4" /> Read full report <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/books/${article.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded border border-[var(--border)] text-[var(--text)] text-[13.5px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
                    >
                      Overview & export
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
          <p className="text-[16px]">No articles found matching your query.</p>
          <button
            onClick={() => setQuery('')}
            className="mt-3 text-[14px] text-[var(--accent)] hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

