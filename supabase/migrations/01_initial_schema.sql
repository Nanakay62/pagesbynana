-- ============================================================================
-- Fiction Publishing Website: Initial Database Schema & RLS Policies
-- Specification: Section 3 (Data Model)
-- ============================================================================

-- 1. Enable pgcrypto for UUID generation if not already active
create extension if not exists "pgcrypto";

-- 2. Books Table
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  synopsis text,
  cover_url text,
  genre text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'completed', 'hiatus')),
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Chapters Table
create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  number int not null,
  title text not null,
  slug text not null,
  content_html text not null,
  word_count int default 0,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published')),
  publish_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (book_id, number),
  unique (book_id, slug)
);

-- 4. Tags & Book-Tags
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists book_tags (
  book_id uuid references books(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (book_id, tag_id)
);

-- 5. Events Table (Cookie-free analytics)
create table if not exists events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('book_open', 'chapter_read', 'chapter_complete', 'donate_click')),
  book_id uuid references books(id) on delete set null,
  chapter_id uuid references chapters(id) on delete set null,
  session_id text,
  referrer text,
  country text,
  created_at timestamptz default now()
);

-- 6. Subscribers Table
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  confirmed boolean default false,
  token text,
  created_at timestamptz default now()
);

-- 7. Chapter Versions Table (Undo history, max 20 per chapter)
create table if not exists chapter_versions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  content_html text not null,
  saved_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_books_slug on books(slug);
create index if not exists idx_books_status on books(status);
create index if not exists idx_chapters_book_status on chapters(book_id, status);
create index if not exists idx_chapters_slug on chapters(slug);
create index if not exists idx_events_created on events(created_at);
create index if not exists idx_events_type on events(type);

-- ============================================================================
-- Row-Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
alter table books enable row level security;
alter table chapters enable row level security;
alter table tags enable row level security;
alter table book_tags enable row level security;
alter table events enable row level security;
alter table subscribers enable row level security;
alter table chapter_versions enable row level security;

-- BOOKS: Public can read published, completed, or hiatus
create policy "Public can view published books"
  on books for select
  using (status in ('published', 'completed', 'hiatus'));

-- BOOKS: Authenticated admin can perform all actions
create policy "Author admin has full access to books"
  on books for all
  to authenticated
  using (true)
  with check (true);

-- CHAPTERS: Public can read published chapters (or scheduled whose publish_at <= now())
create policy "Public can view published chapters"
  on chapters for select
  using (
    status = 'published' or
    (status = 'scheduled' and publish_at <= now())
  );

-- CHAPTERS: Authenticated admin has full access
create policy "Author admin has full access to chapters"
  on chapters for all
  to authenticated
  using (true)
  with check (true);

-- TAGS: Public can read tags
create policy "Public can view tags"
  on tags for select
  using (true);

create policy "Author admin can manage tags"
  on tags for all
  to authenticated
  using (true)
  with check (true);

-- BOOK_TAGS: Public can read book tags
create policy "Public can view book tags"
  on book_tags for select
  using (true);

create policy "Author admin can manage book tags"
  on book_tags for all
  to authenticated
  using (true)
  with check (true);

-- EVENTS: Public can insert only (no select)
create policy "Public can record events"
  on events for insert
  to anon, authenticated
  with check (true);

create policy "Author admin can view analytics events"
  on events for select
  to authenticated
  using (true);

-- SUBSCRIBERS: Public can insert only
create policy "Public can subscribe"
  on subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Author admin can manage subscribers"
  on subscribers for all
  to authenticated
  using (true)
  with check (true);

-- CHAPTER_VERSIONS: Admin only
create policy "Author admin has full access to chapter versions"
  on chapter_versions for all
  to authenticated
  using (true)
  with check (true);
