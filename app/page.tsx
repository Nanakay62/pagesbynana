import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BookCard from '@/components/library/BookCard';
import BookCover from '@/components/library/BookCover';
import ContinueReading from '@/components/library/ContinueReading';
import { getPublishedBooks } from '@/lib/supabase-server';

export default async function HomePage() {
  const books = await getPublishedBooks();
  const featured = books.find((b) => b.is_featured) || books[0];

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
              Pages by Nana is a small home for original fiction. No accounts, no paywalls, no noise — just books, chapters, and the time to read them properly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/books/${featured.slug}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded text-[15px] font-medium bg-[var(--accent)] text-[var(--accent-contrast)] hover:filter hover:brightness-105 transition-all hover:no-underline"
              >
                Start reading
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center justify-center px-6 py-3 rounded text-[15px] font-medium border border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline"
              >
                Browse the library
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
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
          </div>
        </section>

        {/* Continue Reading Strip (reads from localStorage) */}
        <ContinueReading books={books} />

        {/* Library Grid */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
              The library
            </h2>
            <Link href="/books" className="text-[14px] text-[var(--accent)] hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>

        {/* Subscribe Box */}
        <section className="mt-16 p-8 sm:p-10 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] text-center shadow-[var(--shadow)] max-w-2xl mx-auto">
          <h3 className="font-serif-title font-medium text-[22px] text-[var(--text)] mb-2">
            New chapters in your inbox
          </h3>
          <p className="text-[14.5px] text-[var(--muted)] mb-5 max-w-md mx-auto">
            A short, quiet email when a new chapter goes live. No spam, and you can unsubscribe anytime.
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
