const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

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

  // Split on Chapter markers: <p>Chapter X... or <h1>Chapter X...
  const parts = cleaned.split(/(?=<p>(?:<strong>)?Chapter\s+\d+)/gi);
  const chapters = [];

  let chapNum = 1;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract title from first line
    const match = trimmed.match(/^(?:<p>(?:<strong>)?)?(Chapter\s+\d+[^<]*)/i);
    let title = match ? match[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : `Chapter ${chapNum}`;
    
    // Calculate word count
    const plainText = trimmed.replace(/<[^>]*>/g, ' ');
    const wordCount = (plainText.match(/\S+/g) || []).length;

    chapters.push({
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
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('your-project')) {
    console.error('❌ Supabase credentials missing in .env.local!');
    console.error('Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local first.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const manuscripts = [
    {
      file: 'C:/Users/nanak/Desktop/The Silent Code.docx',
      title: 'The Silent Code',
      slug: 'the-silent-code',
      genre: 'Speculative Fiction',
      synopsis: 'In Accra, Kwame Dickson uncovers a silent digital network reshaping the boundaries of identity, technology, and memory.',
      cover_url: 'cover-b',
      is_featured: true,
      status: 'published',
    },
    {
      file: 'C:/Users/nanak/Desktop/I Know You.docx',
      title: 'I Know You',
      slug: 'i-know-you',
      genre: 'Literary Thriller',
      synopsis: 'On the tenth floor of a coastal tower overlooking Accra, an unseen watcher and an invisible harvest collide.',
      cover_url: 'cover-c',
      is_featured: false,
      status: 'published',
    },
  ];

  for (const item of manuscripts) {
    if (!fs.existsSync(item.file)) {
      console.log(`Skipping ${item.title}: File not found at ${item.file}`);
      continue;
    }

    console.log(`\n📖 Processing "${item.title}"...`);
    const chapters = await extractChaptersFromDocx(item.file);
    console.log(`   Found ${chapters.length} chapters.`);

    // Upsert Book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .upsert(
        {
          title: item.title,
          slug: item.slug,
          genre: item.genre,
          synopsis: item.synopsis,
          cover_url: item.cover_url,
          is_featured: item.is_featured,
          status: item.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (bookError) {
      console.error(`   ❌ Error creating book "${item.title}":`, bookError.message);
      continue;
    }

    console.log(`   ✅ Book record created (ID: ${book.id})`);

    // Insert Chapters
    const rows = chapters.map((c) => ({
      book_id: book.id,
      number: c.number,
      title: c.title,
      slug: c.slug,
      content_html: c.content_html,
      word_count: c.word_count,
      status: c.status,
      updated_at: new Date().toISOString(),
    }));

    const { error: chapsError } = await supabase
      .from('chapters')
      .upsert(rows, { onConflict: 'book_id,number' });

    if (chapsError) {
      console.error(`   ❌ Error saving chapters:`, chapsError.message);
    } else {
      console.log(`   🎉 Successfully imported ${chapters.length} chapters for "${item.title}"!`);
    }
  }

  console.log('\n✨ All manuscripts processed and synced to Supabase!\n');
}

main().catch(console.error);
