export type BookStatus = 'draft' | 'published' | 'completed' | 'hiatus';
export type ChapterStatus = 'draft' | 'scheduled' | 'published';

export interface Book {
  id: string;
  title: string;
  slug: string;
  synopsis?: string;
  cover_url?: string;
  genre?: string;
  status: BookStatus;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  book_id: string;
  number: number;
  title: string;
  slug: string;
  content_html: string;
  word_count: number;
  status: ChapterStatus;
  publish_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface AnalyticsEvent {
  id?: number;
  type: 'book_open' | 'chapter_read' | 'chapter_complete' | 'donate_click';
  book_id?: string;
  chapter_id?: string;
  session_id?: string;
  referrer?: string;
  country?: string;
  created_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  token?: string;
  created_at?: string;
}

export interface ChapterVersion {
  id: string;
  chapter_id: string;
  content_html: string;
  saved_at?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  author_name: string;
  author_bio: string;
  paystack_url: string;
  kofi_url: string;
  admin_email: string;
}
