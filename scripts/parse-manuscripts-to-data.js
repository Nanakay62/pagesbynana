const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

function cleanHtml(html) {
  return html
    .replace(/<p[^>]*>\s*(\*\s*){3,}\s*<\/p>/gi, '<div class="scene-break"></div>')
    .replace(/<p[^>]*>\s*(\*\*\*|---|•\s*•\s*•)\s*<\/p>/gi, '<div class="scene-break"></div>')
    .replace(/ style="[^"]*"/gi, '')
    .replace(/ class="[^"]*"/gi, '')
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '')
    .replace(/—/g, ', ')
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function extractChaptersFromDocx(filePath) {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.convertToHtml({ buffer });
  const cleaned = cleanHtml(result.value);

  const parts = cleaned.split(/(?=<p>(?:<strong>)?Chapter\s+\d+)/gi);
  const chapters = [];

  let chapNum = 1;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^(?:<p>(?:<strong>)?)?(Chapter\s+\d+[^<]*)/i);
    let title = match ? match[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : `Chapter ${chapNum}`;
    
    const plainText = trimmed.replace(/<[^>]*>/g, ' ');
    const wordCount = (plainText.match(/\S+/g) || []).length;

    chapters.push({
      id: `c-local-${slugify(title)}-${chapNum}`,
      number: chapNum,
      title,
      slug: slugify(title) || `chapter-${chapNum}`,
      content_html: trimmed,
      word_count: wordCount,
      status: 'published',
    });
    chapNum++;
  }

  return chapters;
}

async function main() {
  const silentCodeChapters = await extractChaptersFromDocx('C:/Users/nanak/Desktop/The Silent Code.docx');
  const iKnowYouChapters = await extractChaptersFromDocx('C:/Users/nanak/Desktop/I Know You.docx');

  console.log(`The Silent Code: ${silentCodeChapters.length} chapters found.`);
  console.log(`I Know You: ${iKnowYouChapters.length} chapters found.`);

  const books = [
    {
      id: 'book-the-silent-code',
      title: 'The Silent Code',
      slug: 'the-silent-code',
      genre: 'Techno-Thriller',
      synopsis: 'In Accra, Kwame Dickson uncovers a silent digital network reshaping the boundaries of identity, technology, and memory.',
      cover_url: '/covers/the-silent-code.jpg',
      is_featured: true,
      status: 'published',
      tags: ['techno-thriller', 'ai', 'cyber', 'accra'],
      chapters: silentCodeChapters.map(c => ({ ...c, book_id: 'book-the-silent-code' })),
    },
    {
      id: 'book-i-know-you',
      title: 'I Know You',
      slug: 'i-know-you',
      genre: 'Techno-Thriller',
      synopsis: 'On the tenth floor of a coastal tower overlooking Accra, an unseen watcher and an invisible harvest collide.',
      cover_url: '/covers/i-know-you.jpg',
      is_featured: false,
      status: 'published',
      tags: ['techno-thriller', 'surveillance', 'accra'],
      chapters: iKnowYouChapters.map(c => ({ ...c, book_id: 'book-i-know-you' })),
    },
  ];

  const outputPath = path.join(__dirname, '..', 'lib', 'local-books.json');
  fs.writeFileSync(outputPath, JSON.stringify(books, null, 2), 'utf8');
  console.log(`Wrote ${books.length} full books to ${outputPath}`);
}

main().catch(console.error);

