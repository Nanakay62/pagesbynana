const fs = require('fs');
const path = require('path');
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

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('your-project')) {
    console.error('❌ Supabase credentials missing in .env.local!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const updates = [
    {
      slug: 'the-silent-code',
      cover_url: '/covers/the-silent-code.jpg',
    },
    {
      slug: 'i-know-you',
      cover_url: '/covers/i-know-you.jpg',
    },
    {
      slug: 'the-illusion-of-skill',
      cover_url: '/covers/the-illusion-of-skill.jpg',
    },
  ];

  console.log('🖼️ Updating book cover URLs in Supabase...\n');

  for (const item of updates) {
    const { data, error } = await supabase
      .from('books')
      .update({ cover_url: item.cover_url, updated_at: new Date().toISOString() })
      .eq('slug', item.slug)
      .select('id, title, slug, cover_url');

    if (error) {
      console.error(`❌ Failed to update ${item.slug}:`, error.message);
    } else if (!data || data.length === 0) {
      console.warn(`⚠️ Book with slug "${item.slug}" not found in database.`);
    } else {
      console.log(`✅ Updated "${data[0].title}" (${data[0].slug}) -> ${data[0].cover_url}`);
    }
  }

  console.log('\n✨ Cover update complete!');
}

main().catch(console.error);

