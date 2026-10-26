import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { sendNewChapterEmail } from '@/lib/email';
import { calculateReadingTime } from '@/lib/reading-time';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        message: 'Database not connected. Simulating publish cron check.',
        publishedCount: 0,
      });
    }

    const now = new Date().toISOString();
    const { data: scheduledChapters, error: fetchError } = await supabaseAdmin
      .from('chapters')
      .select('id, title, slug, chapter_number, word_count, content, book_id, publish_at, books ( id, title, slug )')
      .eq('status', 'scheduled')
      .lte('publish_at', now);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!scheduledChapters || scheduledChapters.length === 0) {
      return NextResponse.json({ message: 'No scheduled chapters ready to publish', publishedCount: 0 });
    }

    // Flip to published
    const ids = scheduledChapters.map((c) => c.id);
    const { error: updateError } = await supabaseAdmin
      .from('chapters')
      .update({ status: 'published', updated_at: now })
      .in('id', ids);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Query confirmed subscribers and dispatch notification emails
    const { data: subscribers } = await supabaseAdmin
      .from('subscribers')
      .select('email, token, book_id')
      .eq('confirmed', true);

    let emailsDispatched = 0;
    if (subscribers && subscribers.length > 0) {
      for (const chapter of scheduledChapters) {
        const book = (chapter as any).books;
        const bookTitle = book?.title || 'Fiction';
        const bookSlug = book?.slug || 'books';
        const readingTime = calculateReadingTime(chapter.word_count || 1000);

        // Filter subscribers interested in this book or all books
        const targetSubs = subscribers.filter(
          (s) => !s.book_id || s.book_id === chapter.book_id
        );

        for (const sub of targetSubs) {
          await sendNewChapterEmail({
            to: sub.email,
            token: sub.token,
            bookTitle,
            chapterNumber: chapter.chapter_number || 1,
            chapterTitle: chapter.title,
            chapterSlug: chapter.slug,
            bookSlug,
            readingTimeMinutes: readingTime,
          });
          emailsDispatched++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      publishedCount: scheduledChapters.length,
      publishedChapters: scheduledChapters.map((c) => c.title),
      emailsDispatched,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
