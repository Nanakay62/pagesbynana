import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: 'About the Author — Pages by Nana',
  description: 'About Nana Kwame Dickson and Pages by Nana.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[680px] w-full mx-auto px-5 py-12 sm:py-16">
        <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
          About
        </div>
        <h1 className="font-serif-title font-normal text-[36px] sm:text-[42px] leading-tight text-[var(--text)] mb-6">
          The author
        </h1>

        <div className="space-y-5 text-[16.5px] leading-[1.75] text-[var(--text)]">
          <p>
            Nana Kwame Dickson writes quiet fiction about memory, language, and the small ceremonies of ordinary life.
            Growing up between Accra and the coast, believing that a story, told slowly and with care, can outlast almost anything.
          </p>
          <p>
            <em>Pages by Nana</em> is a quiet home on the web. There are no advertisements here, no reader paywalls, and no tracking algorithms. Just original books and serials, published in chapters, the way fiction was meant to be experienced.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-[14.5px] text-[var(--muted)]">
          Letters, queries, and questions:{' '}
          <a
            href="mailto:nanakwamedickson@outlook.com"
            className="text-[var(--accent)] hover:underline"
          >
            nanakwamedickson@outlook.com
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
