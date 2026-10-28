import { NextResponse } from 'next/server';
import { getSupabasePublic, getBookBySlug } from '@/lib/supabase-server';
import { sendConfirmationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    let email = '';
    let bookId: string | undefined;
    let bookTitle: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      bookId = body.book_id;
    } else {
      const formData = await request.formData();
      email = (formData.get('email') as string) || '';
      bookId = (formData.get('book_id') as string) || undefined;
    }

    email = email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address required' }, { status: 400 });
    }

    if (bookId) {
      // Find book title if possible
      try {
        const book = await getBookBySlug(bookId);
        if (book) bookTitle = book.title;
      } catch {
        // Continue
      }
    }

    const token = crypto.randomBytes(24).toString('hex');
    const supabase = getSupabasePublic();

    if (supabase) {
      // Upsert subscriber record
      await supabase.from('subscribers').upsert(
        {
          email,
          token,
          confirmed: false,
          book_id: bookId || null,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
    }

    // Dispatch double opt-in confirmation email
    await sendConfirmationEmail({
      to: email,
      token,
      bookTitle,
    });

    const isHtml = request.headers.get('accept')?.includes('text/html');
    if (isHtml) {
      return new Response(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Check Your Inbox | Pages by Nana</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 40px 20px; background-color: #FBF8F3; color: #2A2420; font-family: -apple-system, BlinkMacSystemFont, 'Literata', Georgia, serif; line-height: 1.6; text-align: center; }
    .card { max-width: 500px; margin: 40px auto; background: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; padding: 40px 30px; box-shadow: 0 4px 12px rgba(42,36,32,0.04); }
    h1 { font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-top: 0; color: #2A2420; }
    p { color: #5C524A; font-size: 15.5px; }
    .badge { display: inline-block; background: #F3EAE4; color: #8C2F39; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; }
    a.btn { display: inline-block; background: #8C2F39; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 14.5px; font-weight: 500; margin-top: 20px; }
    a.btn:hover { background: #7A2831; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Almost Done</div>
    <h1>Check your inbox</h1>
    <p>We've sent a verification link to <strong>${email}</strong>.</p>
    <p>Click the link in that email to confirm your subscription and start receiving new chapter releases.</p>
    <a href="/" class="btn">Return to Pages by Nana</a>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email dispatched. Please check your inbox.',
    });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
