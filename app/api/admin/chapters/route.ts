import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not connected. Please set Supabase environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { bookId, chapters, status = 'draft' } = body;

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required.' }, { status: 400 });
    }

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: 'At least one chapter is required.' }, { status: 400 });
    }

    const rowsToInsert = chapters.map((c: any, index: number) => ({
      book_id: bookId,
      number: c.number || index + 1,
      title: c.title || `Chapter ${index + 1}`,
      slug: c.slug || `chapter-${index + 1}`,
      content_html: c.content_html || '',
      word_count: c.word_count || 0,
      status: c.status || status,
      updated_at: new Date().toISOString(),
    }));

    // Upsert chapters on conflict (book_id, number)
    const { data, error } = await supabaseAdmin
      .from('chapters')
      .upsert(rowsToInsert, { onConflict: 'book_id,number' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      chapters: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
