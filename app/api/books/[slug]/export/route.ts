import { NextResponse } from 'next/server';
import { getBookBySlug } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'markdown';

    const book = await getBookBySlug(slug);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const chapters = book.chapters || [];

    if (format === 'markdown') {
      let md = `# ${book.title}\n\n`;
      md += `**Author:** Nana Kwame Dickson\n`;
      md += `**Genre:** ${book.genre || 'Fiction'}\n`;
      md += `**Status:** ${book.status || 'Ongoing'}\n`;
      md += `**Exported From:** Pages by Nana (https://pagesbynana.com/books/${book.slug})\n\n`;
      md += `## Synopsis\n\n${book.synopsis}\n\n`;
      md += `## Table of Contents\n\n`;
      chapters.forEach((c) => {
        md += `${c.number}. [Chapter ${c.number}: ${c.title}](#chapter-${c.number})\n`;
      });
      md += `\n---\n\n`;

      chapters.forEach((c) => {
        md += `<a id="chapter-${c.number}"></a>\n\n`;
        md += `# Chapter ${c.number}: ${c.title}\n\n`;

        // Convert HTML content into clean readable Markdown
        let cleanText = c.content_html || '';
        cleanText = cleanText.replace(/<div class="scene-break"><\/div>/g, '\n\n* * *\n\n');
        cleanText = cleanText.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n');
        cleanText = cleanText.replace(/<em>/g, '*').replace(/<\/em>/g, '*');
        cleanText = cleanText.replace(/<strong>/g, '**').replace(/<\/strong>/g, '**');
        cleanText = cleanText.replace(/<blockquote>/g, '> ').replace(/<\/blockquote>/g, '\n\n');
        cleanText = cleanText.replace(/<[^>]+>/g, ''); // strip any remaining tags
        cleanText = cleanText.trim();

        md += `${cleanText}\n\n---\n\n`;
      });

      return new Response(md, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${book.slug}-complete.md"`,
        },
      });
    }

    if (format === 'html') {
      let chapterHtml = '';
      chapters.forEach((c) => {
        chapterHtml += `
          <article id="ch-${c.number}" style="margin-bottom: 80px; page-break-after: always;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #8C2F39; font-weight: 600; margin-bottom: 8px;">
              Chapter ${c.number}
            </div>
            <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 28px; font-weight: normal; margin-top: 0; margin-bottom: 24px; color: #2A2420;">
              ${c.title}
            </h2>
            <div style="font-family: 'Literata', Georgia, serif; font-size: 18px; line-height: 1.8; color: #2A2420;">
              ${c.content_html}
            </div>
          </article>
        `;
      });

      const tocHtml = chapters
        .map(
          (c) =>
            `<li style="margin-bottom: 8px;"><a href="#ch-${c.number}" style="color: #8C2F39; text-decoration: none;">Chapter ${c.number}: ${c.title}</a></li>`
        )
        .join('');

      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${book.title} — Nana Kwame Dickson (Offline Reader)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 60px 20px;
      background: #FBF8F3;
      color: #2A2420;
      font-family: 'Literata', Georgia, serif;
      line-height: 1.8;
    }
    .wrapper {
      max-width: 680px;
      margin: 0 auto;
    }
    .scene-break {
      text-align: center;
      margin: 3em 0;
    }
    .scene-break::before {
      content: "✦   ✦   ✦";
      letter-spacing: 0.6em;
      color: #8C2F39;
      font-size: 0.85em;
    }
    @media print {
      body { background: #fff; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <header style="text-align: center; margin-bottom: 80px; padding-bottom: 40px; border-bottom: 1px solid #E8DFD5;">
      <h1 style="font-family: 'Fraunces', Georgia, serif; font-size: 42px; font-weight: normal; margin-bottom: 12px; color: #2A2420;">
        ${book.title}
      </h1>
      <p style="font-size: 16px; color: #5C524A; margin-bottom: 24px;">
        by <strong>Nana Kwame Dickson</strong>
      </p>
      <p style="font-size: 15px; font-style: italic; color: #5C524A; max-width: 520px; margin: 0 auto 30px;">
        ${book.synopsis}
      </p>
      <div style="text-align: left; background: #fff; padding: 24px 32px; border-radius: 8px; border: 1px solid #E8DFD5; margin-top: 30px;">
        <h3 style="margin-top: 0; font-family: 'Fraunces', Georgia, serif; font-size: 18px;">Table of Contents</h3>
        <ol style="padding-left: 20px; margin-bottom: 0;">
          ${tocHtml}
        </ol>
      </div>
    </header>

    <main>
      ${chapterHtml}
    </main>

    <footer style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #E8DFD5; text-align: center; font-size: 13px; color: #8F8378;">
      Published on Pages by Nana · Free to read and download.
    </footer>
  </div>
</body>
</html>`;

      return new Response(fullHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${book.slug}-reader-bundle.html"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format. Use format=markdown or format=html' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
