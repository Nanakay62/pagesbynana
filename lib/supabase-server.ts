import { createClient } from '@supabase/supabase-js';
import { SAMPLE_BOOKS } from './sample-data';
import { Book, Chapter } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project')
);

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
}

export function getSupabasePublic() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Fetch all published books (falls back to sample dataset ONLY when DB is completely unconfigured)
 */
export async function getPublishedBooks(): Promise<Book[]> {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return SAMPLE_BOOKS;
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, chapters(*)')
      .in('status', ['published', 'completed', 'hiatus'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published books from Supabase:', error);
      return [];
    }

    const books = (data || []).map((b: any) => ({
      ...b,
      chapters: (b.chapters || []).sort((c1: any, c2: any) => (c1.number || 0) - (c2.number || 0)),
    }));

    return books as Book[];
  } catch (err) {
    console.error('Failed to query Supabase books:', err);
    return [];
  }
}

/**
 * Fetch all books including drafts for admin management
 */
export async function getAllAdminBooks(): Promise<Book[]> {
  const supabase = getSupabaseAdmin() || getSupabasePublic();
  if (!supabase) {
    return SAMPLE_BOOKS;
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, chapters(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin books from Supabase:', error);
      return [];
    }

    const books = (data || []).map((b: any) => ({
      ...b,
      chapters: (b.chapters || []).sort((c1: any, c2: any) => (c1.number || 0) - (c2.number || 0)),
    }));

    return books as Book[];
  } catch (err) {
    console.error('Failed to query Supabase admin books:', err);
    return [];
  }
}

/**
 * Fetch a single book by slug
 */
export async function getBookBySlug(slug: string): Promise<Book | null> {
  const books = await getPublishedBooks();
  return books.find((b) => b.slug === slug) || null;
}

/**
 * Fetch a specific chapter by book slug and chapter slug
 */
export async function getChapter(
  bookSlug: string,
  chapterSlug: string
): Promise<{ book: Book; chapter: Chapter } | null> {
  const book = await getBookBySlug(bookSlug);
  if (!book || !book.chapters) return null;

  const chapter = book.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return null;

  return { book, chapter };
}
