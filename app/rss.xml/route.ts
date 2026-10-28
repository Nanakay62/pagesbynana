import { getPublishedBooks } from '@/lib/supabase-server';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pagesbynana.com';
  const books = await getPublishedBooks();

  const allChapters = books.flatMap((b) =>
    (b.chapters || []).map((c) => ({
      book: b,
      chapter: c,
    }))
  );

  const rssItems = allChapters
    .map(({ book, chapter }) => {
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
      <title><![CDATA[${book.title}: Chapter ${chapter.number}: ${chapter.title}]]></title>
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
    <title>Pages by Nana</title>
    <link>${baseUrl}</link>
    <description>Original fiction, quietly told. Read books chapter by chapter, free, with no account required.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
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
