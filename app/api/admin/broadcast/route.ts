import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { sendNewChapterEmail } from '@/lib/email';
import { SAMPLE_BOOKS } from '@/lib/sample-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, chapterTitle, excerpt, testEmail } = body;

    const book = SAMPLE_BOOKS.find((b) => b.id === bookId) || SAMPLE_BOOKS[0];
    const chapter = book.chapters?.[0] || {
      number: 1,
      title: 'The Flickering',
      slug: 'the-flickering',
    };

    const supabaseAdmin = getSupabaseAdmin();
    let recipients: Array<{ email: string; token: string }> = [];

    if (testEmail) {
      recipients = [{ email: testEmail, token: 'test-token-123' }];
    } else if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('subscribers')
        .select('email, token')
        .eq('confirmed', true);
      if (data) recipients = data;
    } else {
      // Local fallback recipients
      recipients = [
        { email: 'ama.osei@example.com', token: 'mock-token-1' },
        { email: 'k.mensah@example.com', token: 'mock-token-2' },
      ];
    }

    let sent = 0;
    for (const r of recipients) {
      await sendNewChapterEmail({
        to: r.email,
        token: r.token,
        bookTitle: book.title,
        chapterNumber: chapter.number,
        chapterTitle: chapterTitle || chapter.title,
        excerpt: excerpt || 'The lantern’s iron frame had grown cold before the wick was even struck...',
        chapterSlug: chapter.slug,
        bookSlug: book.slug,
        readingTimeMinutes: 7,
      });
      sent++;
    }

    return NextResponse.json({
      success: true,
      recipientsCount: sent,
      message: `Notification dispatched to ${sent} subscriber(s).`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
