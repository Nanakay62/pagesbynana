import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BookCard from '@/components/library/BookCard';
import BookCover from '@/components/library/BookCover';
import ContinueReading from '@/components/library/ContinueReading';
import { getPublishedBooks } from '@/lib/supabase-server';
import { isArticle } from '@/lib/types';
import { formatWords, calculateReadingTime } from '@/lib/reading-time';
import { ArrowRight, Clock, FileText } from 'lucide-react';

export default async function HomePage() {
  const books = await getPublishedBooks();
  const fiction = books.filter((b) => !isArticle(b));
  const articles = books.filter(isArticle);
  const featured = fiction.find((b) => b.is_featured) || fiction[0] || books[0];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-8 sm:py-14">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 items-center py-4 sm:py-8">
          <div>
            <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
              New this week
            </div>
            <h1 className="font-serif-title font-normal text-[36px] sm:text-[50px] leading-[1.08] text-[var(--text)] mb-4">
              Stories told slowly, in a <em className="italic text-[var(--accent)] font-serif-title">quiet</em> corner of the internet.
            </h1>
            <p className="text-[16.5px] leading-relaxed text-[var(--muted)] max-w-[500px] mb-6">
              Pages by Nana is a small home for original fiction and sharp investigative reports. No accounts, no paywalls, no noise: just thoughtful words and the time to read them properly.
            </p>
            <div className="flex flex-wrap gap-3">
              {featured ? (
                <Link
                  href={`/books/${featured.slug}`}
                  className="btn-accent inline-flex items-center justify-center px-6 py-3 rounded text-[15px] font-medium bg-[var(--accent)] text-white hover:filter hover:brightness-105 transition-all hover:no-underline"
                >
                  Start reading
                </Link>
              ) : null}
              <Link
                href="/books"
                className="inline-flex items-center justify-center px-6 py-3 rounded text-[15px] font-medium border border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline"
              >
                Browse fiction
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-6 py-3 rounded text-[15px] font-medium border border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline"
              >
                Special reports
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            {featured ? (
              <Link
                href={`/books/${featured.slug}`}
                className="w-full max-w-[280px] group transition-transform hover:-translate-y-1 hover:no-underline"
                aria-label={`Featured: ${featured.title}`}
              >
                <BookCover
                  title={featured.title}
                  coverStyle={featured.cover_url || 'cover-a'}
                  className="shadow-[var(--shadow-lg)]"
                />
              </Link>
            ) : (
              <div className="w-full max-w-[280px] h-[360px] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center p-6 text-center text-[var(--muted)]">
                <span className="font-serif-title text-[20px] mb-2 text-[var(--text)]">Pages by Nana</span>
                <span className="text-[13px]">Original fiction coming soon.</span>
              </div>
            )}
          </div>
        </section>

        {/* Continue Reading Strip (reads from localStorage) */}
        <ContinueReading books={books} />

        {/* Serial Fiction Grid */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
                Serialized Fiction
              </h2>
              <p className="text-[13px] text-[var(--muted)] mt-0.5">
                Novels and long-form serials released chapter by chapter.
              </p>
            </div>
            <Link href="/books" className="text-[14px] text-[var(--accent)] hover:underline">
              View all fiction →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {fiction.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>

        {/* Special Reports & Articles Section */}
        {articles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--border)]">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
                  Special Reports & Articles
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Deep dives, digital economics teardowns, and investigative essays.
                </p>
              </div>
              <Link href="/articles" className="text-[14px] text-[var(--accent)] hover:underline">
                View all articles →
              </Link>
            </div>

            <div className="space-y-6">
              {articles.map((article) => {
                const totalWords = article.chapters
                  ? article.chapters.reduce((sum, c) => sum + (c.word_count || 0), 0)
                  : 0;
                const readingTime = calculateReadingTime(totalWords);
                const firstChap = article.chapters?.[0];
                const readUrl = firstChap
                  ? `/books/${article.slug}/${firstChap.slug}`
                  : `/books/${article.slug}`;

                return (
                  <div
                    key={article.id}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 p-6 sm:p-7 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] hover:border-[var(--accent)] transition-all group"
                  >
                    <div className="w-full max-w-[180px] mx-auto md:mx-0">
                      <Link href={readUrl} className="block group-hover:scale-[1.01] transition-transform">
                        <BookCover
                          title={article.title}
                          coverStyle={article.cover_url}
                          className="shadow-sm"
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
                          <span className="text-[12.5px] text-[var(--muted)]">·</span>
                          <span className="text-[12.5px] text-[var(--muted)]">
                            {formatWords(totalWords)} words
                          </span>
                        </div>

                        <h3 className="font-serif-title font-medium text-[22px] sm:text-[26px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-2">
                          <Link href={readUrl} className="hover:no-underline text-inherit">
                            {article.title}
                          </Link>
                        </h3>

                        <div className="text-[13px] text-[var(--muted)] mb-3">
                          by Nana Kwame Dickson
                        </div>

                        {article.synopsis && (
                          <p className="text-[14.5px] leading-relaxed text-[var(--text)] opacity-90 max-w-xl mb-4">
                            {article.synopsis}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[var(--border)] flex items-center gap-3">
                        <Link
                          href={readUrl}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all hover:no-underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> Read full report <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Subscribe Box */}
        <section className="mt-16 p-8 sm:p-10 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] text-center shadow-[var(--shadow)] max-w-2xl mx-auto">
          <h3 className="font-serif-title font-medium text-[22px] text-[var(--text)] mb-2">
            New chapters & articles in your inbox
          </h3>
          <p className="text-[14.5px] text-[var(--muted)] mb-5 max-w-md mx-auto">
            A short, quiet email when a new release or special report goes live. No spam, and you can unsubscribe anytime.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            action="/api/subscribe"
            method="POST"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14.5px] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14.5px] hover:brightness-105 transition-all"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
