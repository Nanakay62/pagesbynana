import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import ReaderView from '@/components/reader/ReaderView';
import { getChapter, getPublishedBooks } from '@/lib/supabase-server';

export async function generateStaticParams() {
  const books = await getPublishedBooks();
  return books.flatMap((b) =>
    (b.chapters || []).map((c) => ({
      slug: b.slug,
      chapterSlug: c.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}) {
  const { slug, chapterSlug } = await params;
  const data = await getChapter(slug, chapterSlug);
  if (!data) return { title: 'Chapter Not Found | Pages by Nana' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';
  const chapterUrl = `${baseUrl}/books/${data.book.slug}/${data.chapter.slug}`;

  return {
    title: `${data.chapter.title}: ${data.book.title} | Pages by Nana`,
    description: `Read Chapter ${data.chapter.number} of ${data.book.title} online. Free, distraction-free reading.`,
    alternates: {
      canonical: chapterUrl,
    },
    openGraph: {
      title: `${data.chapter.title}: ${data.book.title}`,
      description: `Read Chapter ${data.chapter.number} of ${data.book.title} online by Nana Kwame Dickson.`,
      url: chapterUrl,
      type: 'article',
      authors: ['Nana Kwame Dickson'],
    },
    twitter: {
      card: 'summary',
      title: `${data.chapter.title}: ${data.book.title}`,
      description: `Chapter ${data.chapter.number} of ${data.book.title} online.`,
    },
  };
}

export default async function ChapterReaderPage({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}) {
  const { slug, chapterSlug } = await params;
  const data = await getChapter(slug, chapterSlug);

  if (!data) {
    notFound();
  }

  const { book, chapter } = data;
  const chapters = book.chapters || [];
  const currentIndex = chapters.findIndex((c) => c.id === chapter.id);

  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const cleanHtml = DOMPurify.sanitize(chapter.content_html, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'blockquote', 'hr', 'h2', 'h3', 'h4',
      'ul', 'ol', 'li', 'span', 'div', 'br', 'a'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapter.title,
    position: chapter.number,
    isPartOf: {
      '@type': 'Book',
      name: book.title,
      url: `${baseUrl}/books/${book.slug}`,
    },
    author: {
      '@type': 'Person',
      name: 'Nana Kwame Dickson',
    },
    wordCount: chapter.word_count,
    inLanguage: 'en',
    url: `${baseUrl}/books/${book.slug}/${chapter.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReaderView
        book={book}
        chapter={chapter}
        cleanHtml={cleanHtml}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    </>
  );
}
