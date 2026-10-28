import { getBookBySlug, getPublishedBooks } from '@/lib/supabase-server';

export async function generateStaticParams() {
  const books = await getPublishedBooks();
  return books.map((b) => ({ slug: b.slug }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';
  const book = await getBookBySlug(slug);

  if (!book) {
    return new Response('Book not found', { status: 404 });
  }

  const chapters = book.chapters || [];
  const rssItems = chapters
    .map((chapter) => {
      const url = `${baseUrl}/books/${book.slug}/${chapter.slug}`;
      const pubDate = chapter.created_at
        ? new Date(chapter.created_at).toUTCString()
        : new Date().toUTCString();
      const snippet = chapter.content_html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240);

      return `
    <item>
      <title><![CDATA[Chapter ${chapter.number}: ${chapter.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${snippet}...]]></description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${book.title} | Pages by Nana</title>
    <link>${baseUrl}/books/${book.slug}</link>
    <description>${book.synopsis || `Chapters of ${book.title} by Nana Kwame Dickson.`}</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/books/${book.slug}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
