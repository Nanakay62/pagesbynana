import { NextResponse } from 'next/server';
import { getSupabasePublic } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, book_id, chapter_id, session_id } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    const country = request.headers.get('x-vercel-ip-country') || 'GH';
    const referrer = request.headers.get('referer') || '';

    const supabase = getSupabasePublic();
    if (supabase) {
      await supabase.from('events').insert({
        type,
        book_id: book_id || null,
        chapter_id: chapter_id || null,
        session_id: session_id || null,
        referrer,
        country,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
