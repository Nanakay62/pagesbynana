import { notFound } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BookDetailClient from './BookDetailClient';
import { getBookBySlug, getPublishedBooks } from '@/lib/supabase-server';

export async function generateStaticParams() {
  const books = await getPublishedBooks();
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: 'Book Not Found — Pages by Nana' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';

  return {
    title: `${book.title} — Pages by Nana`,
    description: book.synopsis || `Read ${book.title} by Nana Kwame Dickson.`,
    alternates: {
      canonical: `${baseUrl}/books/${book.slug}`,
      types: {
        'application/rss+xml': `${baseUrl}/books/${book.slug}/rss.xml`,
      },
    },
    openGraph: {
      title: `${book.title} — Pages by Nana`,
      description: book.synopsis || `Original fiction by Nana Kwame Dickson.`,
      url: `${baseUrl}/books/${book.slug}`,
      type: 'book',
      authors: ['Nana Kwame Dickson'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} — Pages by Nana`,
      description: book.synopsis,
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: 'Nana Kwame Dickson',
    },
    genre: book.genre,
    description: book.synopsis,
    inLanguage: 'en',
    url: `${baseUrl}/books/${book.slug}`,
    numberOfPages: book.chapters?.length || 1,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-8 sm:py-12">
        <BookDetailClient book={book} />
      </main>
      <Footer />
    </>
  );
}
