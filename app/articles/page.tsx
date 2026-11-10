import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ArticlesClient from './ArticlesClient';
import { getPublishedArticles } from '@/lib/supabase-server';

export const metadata = {
  title: 'Special Reports & Articles | Pages by Nana',
  description: 'In-depth investigations, essays, and reports on technology, culture, and digital systems by Nana Kwame Dickson.',
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-10 sm:py-14">
        <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
          Non-Fiction & Analysis
        </div>
        <h1 className="font-serif-title font-medium text-[34px] sm:text-[40px] text-[var(--text)] mb-3">
          Special Reports & Articles
        </h1>
        <p className="text-[16px] text-[var(--muted)] max-w-xl mb-8 leading-relaxed">
          In-depth investigations, technology teardowns, and essays on the hidden economics of the modern digital world.
        </p>

        <ArticlesClient articles={articles} />
      </main>
      <Footer />
    </>
  );
}

