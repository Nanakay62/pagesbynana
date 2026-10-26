import mammoth from 'mammoth';
import { countWordsFromHtml } from './reading-time';

export interface ExtractedChapter {
  number: number;
  title: string;
  slug: string;
  content_html: string;
  word_count: number;
  preview: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Clean Word HTML:
 * - Strip fonts, colors, inline styles
 * - Convert scene breaks (* * *, ***, etc.) to <div class="scene-break"></div>
 * - Remove empty paragraphs
 */
export function cleanWordHtml(html: string): string {
  let cleaned = html
    // Convert scene breaks (centered * * *, ***, • • •, etc.)
    .replace(/<p[^>]*>\s*(\*\s*){3,}\s*<\/p>/gi, '<div class="scene-break"></div>')
    .replace(/<p[^>]*>\s*(\*\*\*|---|•\s*•\s*•)\s*<\/p>/gi, '<div class="scene-break"></div>')
    // Strip inline styles, font families, colors, spans without class
    .replace(/ style="[^"]*"/gi, '')
    .replace(/ class="[^"]*"/gi, '')
    // Remove empty paragraphs
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '')
    .trim();

  return cleaned;
}

/**
 * Parse a .docx file buffer and split into chapters based on Headings or 'Chapter X' markers.
 */
export async function parseDocxManuscript(
  buffer: Buffer
): Promise<ExtractedChapter[]> {
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Title'] => h1:fresh",
      ],
    }
  );

  const rawHtml = result.value;
  const cleanedHtml = cleanWordHtml(rawHtml);

  // Strategy 1: Split on <h1> or <h2> headings
  const headingRegex = /<(h[12])>(.*?)<\/\1>/gi;
  const headingMatches = Array.from(cleanedHtml.matchAll(headingRegex));

  const chapters: ExtractedChapter[] = [];

  if (headingMatches.length > 1) {
    for (let i = 0; i < headingMatches.length; i++) {
      const match = headingMatches[i];
      const title = match[2].replace(/<[^>]*>/g, '').trim() || `Chapter ${i + 1}`;
      const startIndex = match.index! + match[0].length;
      const endIndex =
        i < headingMatches.length - 1
          ? headingMatches[i + 1].index!
          : cleanedHtml.length;

      const bodyHtml = cleanedHtml.slice(startIndex, endIndex).trim();
      const words = countWordsFromHtml(bodyHtml);
      const textPreview = bodyHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

      chapters.push({
        number: i + 1,
        title,
        slug: slugify(title) || `chapter-${i + 1}`,
        content_html: bodyHtml,
        word_count: words,
        preview: textPreview ? `${textPreview}...` : 'Empty chapter',
      });
    }
    return chapters;
  }

  // Strategy 2 Fallback: Split on lines/paragraphs starting with "Chapter" followed by number/words
  const chapterParaRegex = /<p>\s*(?:<strong>|<b>)?\s*(Chapter\s+(?:[0-9]+|[IVXLCDM]+|[A-Za-z]+)(?::\s*.*?)?)\s*(?:<\/strong>|<\/b>)?\s*<\/p>/gi;
  const paraMatches = Array.from(cleanedHtml.matchAll(chapterParaRegex));

  if (paraMatches.length > 1) {
    for (let i = 0; i < paraMatches.length; i++) {
      const match = paraMatches[i];
      const title = match[1].replace(/<[^>]*>/g, '').trim();
      const startIndex = match.index! + match[0].length;
      const endIndex =
        i < paraMatches.length - 1
          ? paraMatches[i + 1].index!
          : cleanedHtml.length;

      const bodyHtml = cleanedHtml.slice(startIndex, endIndex).trim();
      const words = countWordsFromHtml(bodyHtml);
      const textPreview = bodyHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

      chapters.push({
        number: i + 1,
        title,
        slug: slugify(title) || `chapter-${i + 1}`,
        content_html: bodyHtml,
        word_count: words,
        preview: textPreview ? `${textPreview}...` : 'Empty chapter',
      });
    }
    return chapters;
  }

  // Single Chapter Fallback if no distinct chapters were detected
  const totalWords = countWordsFromHtml(cleanedHtml);
  chapters.push({
    number: 1,
    title: 'Chapter 1',
    slug: 'chapter-1',
    content_html: cleanedHtml,
    word_count: totalWords,
    preview: cleanedHtml.replace(/<[^>]*>/g, ' ').slice(0, 160) + '...',
  });

  return chapters;
}
