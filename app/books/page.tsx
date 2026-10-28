import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BooksLibraryClient from './BooksLibraryClient';
import { getPublishedBooks } from '@/lib/supabase-server';

export const metadata = {
  title: 'Library | Pages by Nana',
  description: 'Browse all original fiction, books, and chapters.',
};

export default async function LibraryPage() {
  const books = await getPublishedBooks();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-10 sm:py-14">
        <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
          Library
        </div>
        <h1 className="font-serif-title font-medium text-[34px] sm:text-[40px] text-[var(--text)] mb-3">
          All books
        </h1>
        <p className="text-[16px] text-[var(--muted)] max-w-xl mb-8 leading-relaxed">
          Original fiction and serials. Read in any order. Come back any time: your browser will remember where you left off.
        </p>

        <BooksLibraryClient books={books} />
      </main>
      <Footer />
    </>
  );
}
