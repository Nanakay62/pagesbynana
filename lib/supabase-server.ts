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

// Offline tracker to prevent hanging on repeated requests when DNS/Supabase fails
let isDatabaseOffline = false;
let lastDbCheck = 0;
const RETRY_INTERVAL_MS = 60 * 1000; // Retry after 60 seconds

// Custom fetch wrapper with 1.5s max timeout to prevent page freezes
const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
};

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: { fetch: customFetch },
  });
}

export function getSupabasePublic() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { fetch: customFetch },
  });
}

/**
 * Fetch all published books
 */
export async function getPublishedBooks(): Promise<Book[]> {
  // If recently failed, immediately return local books without delay
  if (isDatabaseOffline && Date.now() - lastDbCheck < RETRY_INTERVAL_MS) {
    return SAMPLE_BOOKS;
  }

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
      console.warn('Supabase published books query warning:', error.message);
      isDatabaseOffline = true;
      lastDbCheck = Date.now();
      return SAMPLE_BOOKS;
    }

    if (!data || data.length === 0) {
      return SAMPLE_BOOKS;
    }

    isDatabaseOffline = false;
    const books = data.map((b: any) => ({
      ...b,
      chapters: (b.chapters || []).sort((c1: any, c2: any) => (c1.number || 0) - (c2.number || 0)),
    }));

    return books as Book[];
  } catch (err: any) {
    console.warn('Supabase published books unreachable, using local books:', err.message);
    isDatabaseOffline = true;
    lastDbCheck = Date.now();
    return SAMPLE_BOOKS;
  }
}

/**
 * Fetch all books including drafts for admin management
 */
export async function getAllAdminBooks(): Promise<Book[]> {
  // If recently failed, immediately return local books without delay
  if (isDatabaseOffline && Date.now() - lastDbCheck < RETRY_INTERVAL_MS) {
    return SAMPLE_BOOKS;
  }

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
      console.warn('Supabase admin books query warning:', error.message);
      isDatabaseOffline = true;
      lastDbCheck = Date.now();
      return SAMPLE_BOOKS;
    }

    if (!data || data.length === 0) {
      return SAMPLE_BOOKS;
    }

    isDatabaseOffline = false;
    const books = data.map((b: any) => ({
      ...b,
      chapters: (b.chapters || []).sort((c1: any, c2: any) => (c1.number || 0) - (c2.number || 0)),
    }));

    return books as Book[];
  } catch (err: any) {
    console.warn('Supabase admin books unreachable, using local books:', err.message);
    isDatabaseOffline = true;
    lastDbCheck = Date.now();
    return SAMPLE_BOOKS;
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
