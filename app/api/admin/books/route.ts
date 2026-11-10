import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabasePublic } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin() || getSupabasePublic();
    if (!supabase) {
      return NextResponse.json({ books: [] });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*, chapters(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ books: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const { title, slug, synopsis, genre, status, cover_url, is_featured } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('books')
      .insert([
        {
          title,
          slug,
          synopsis: synopsis || null,
          genre: genre || 'Literary Fiction',
          status: status || 'draft',
          cover_url: cover_url || 'cover-a',
          is_featured: Boolean(is_featured),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, book: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not connected. Please set Supabase environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, title, slug, synopsis, genre, status, cover_url, is_featured, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (title !== undefined) updatePayload.title = title;
    if (slug !== undefined) updatePayload.slug = slug;
    if (synopsis !== undefined) updatePayload.synopsis = synopsis;
    if (genre !== undefined) updatePayload.genre = genre;
    if (status !== undefined) updatePayload.status = status;
    if (cover_url !== undefined) updatePayload.cover_url = cover_url;
    if (is_featured !== undefined) updatePayload.is_featured = Boolean(is_featured);
    if (tags !== undefined) updatePayload.tags = tags;

    const { data, error } = await supabaseAdmin
      .from('books')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, book: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
