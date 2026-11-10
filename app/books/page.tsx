import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BooksLibraryClient from './BooksLibraryClient';
import { getPublishedFiction } from '@/lib/supabase-server';
import { FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Library | Pages by Nana',
  description: 'Browse all original fiction, books, and serial chapters.',
};

export default async function LibraryPage() {
  const books = await getPublishedFiction();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
              Fiction Library
            </div>
            <h1 className="font-serif-title font-medium text-[34px] sm:text-[40px] text-[var(--text)] mb-3">
              Novels & Serial Fiction
            </h1>
            <p className="text-[16px] text-[var(--muted)] max-w-xl leading-relaxed">
              Original speculative fiction and techno-thrillers. Read chapter by chapter, at your own pace.
            </p>
          </div>

          <Link
            href="/articles"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-[13.5px] text-[var(--text)] hover:border-[var(--accent)] transition-all hover:no-underline shadow-sm"
          >
            <FileText className="w-4 h-4 text-[var(--accent)]" />
            <span>Looking for non-fiction? <strong>Read Articles</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)]" />
          </Link>
        </div>

        <BooksLibraryClient books={books} />
      </main>
      <Footer />
    </>
  );
}
