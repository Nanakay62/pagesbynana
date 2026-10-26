import Link from 'next/link';
import { getPublishedBooks } from '@/lib/supabase-server';
import { formatWords } from '@/lib/reading-time';
import { TrendingUp, Users, BookOpen, Heart, Plus, Globe, Share2, CheckCircle2 } from 'lucide-react';

export default async function AdminDashboardPage() {
  const books = await getPublishedBooks();
  const totalChapters = books.reduce((sum, b) => sum + (b.chapters?.length || 0), 0);
  const totalWords = books.reduce(
    (sum, b) => sum + (b.chapters?.reduce((cSum, c) => cSum + (c.word_count || 0), 0) || 0),
    0
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif-title font-medium text-[28px] text-[var(--text)]">
            Good morning, Nana
          </h1>
          <p className="text-[14px] text-[var(--muted)]">
            Here is the analytics pulse for <em>Pages by Nana</em>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/books/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13.5px] font-medium hover:brightness-105 transition-all hover:no-underline"
          >
            <Plus className="w-4 h-4" /> New book
          </Link>
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] text-[13.5px] hover:bg-[var(--surface)] transition-all hover:no-underline"
          >
            Import .docx
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            <span>Reads (30d)</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="font-serif-title text-[28px] font-medium text-[var(--text)]">
            4,218
          </div>
          <div className="text-[12px] text-[var(--accent)] font-medium mt-1">
            ↑ 12% vs prior month
          </div>
        </div>

        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            <span>Unique readers</span>
            <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
          </div>
          <div className="font-serif-title text-[28px] font-medium text-[var(--text)]">
            1,847
          </div>
          <div className="text-[12px] text-[var(--muted)] mt-1">
            Cookie-free sessions
          </div>
        </div>

        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            <span>Subscribers</span>
            <BookOpen className="w-3.5 h-3.5 text-[var(--muted)]" />
          </div>
          <div className="font-serif-title text-[28px] font-medium text-[var(--text)]">
            312
          </div>
          <div className="text-[12px] text-[var(--accent)] font-medium mt-1">
            +14 new this week
          </div>
        </div>

        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            <span>Paystack tips</span>
            <Heart className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="font-serif-title text-[28px] font-medium text-[var(--text)]">
            $86
          </div>
          <div className="text-[12px] text-[var(--muted)] mt-1">
            from 23 readers
          </div>
        </div>
      </div>

      {/* Chapter Reads & Completion Rates */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-title font-medium text-[18px] text-[var(--text)]">
            Chapter Reads &amp; Completion Rate
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            Shows where readers complete past 90%
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {[
            { title: 'The Flickering', book: 'The Lantern Keeper', num: 1, reads: 940, comp: 812 },
            { title: 'The Inventory of Flames', book: 'The Lantern Keeper', num: 2, reads: 780, comp: 690 },
            { title: 'What the Oil Remembers', book: 'The Lantern Keeper', num: 3, reads: 640, comp: 580 },
            { title: 'The First Letter', book: 'Ember & Ink', num: 1, reads: 590, comp: 520 },
          ].map((row, idx) => {
            const rate = Math.round((row.comp / row.reads) * 100);
            return (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[14px]">
                <div>
                  <div className="font-medium text-[var(--text)] flex items-center gap-2">
                    {row.title}
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]">
                      {rate}% completed
                    </span>
                  </div>
                  <div className="text-[12px] text-[var(--muted)]">
                    {row.book} · Chapter {row.num}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[13px] text-[var(--muted)]">
                  <span><strong>{row.reads}</strong> opens</span>
                  <span>·</span>
                  <span className="text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {row.comp} finished
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referrers & Geographic Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Geographic */}
        <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-2 font-serif-title font-medium text-[17px] text-[var(--text)] mb-4">
            <Globe className="w-4 h-4 text-[var(--accent)]" /> Top Reader Regions
          </div>
          <div className="space-y-3 text-[13.5px]">
            <div className="flex justify-between items-center">
              <span>🇬🇭 Ghana</span>
              <span className="font-semibold text-[var(--text)]">68%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--accent)] h-full w-[68%]" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span>🇬🇧 United Kingdom</span>
              <span className="font-semibold text-[var(--text)]">16%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--accent)] h-full w-[16%]" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span>🇺🇸 United States</span>
              <span className="font-semibold text-[var(--text)]">10%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--accent)] h-full w-[10%]" />
            </div>
          </div>
        </div>

        {/* Referrers */}
        <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-2 font-serif-title font-medium text-[17px] text-[var(--text)] mb-4">
            <Share2 className="w-4 h-4 text-[var(--accent)]" /> Discovery Channels
          </div>
          <div className="space-y-3 text-[13.5px]">
            <div className="flex justify-between items-center">
              <span>Direct / Bookmarks & PWA</span>
              <span className="font-semibold text-[var(--text)]">48%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--muted)] h-full w-[48%]" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span>WhatsApp & Messages</span>
              <span className="font-semibold text-[var(--text)]">28%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--muted)] h-full w-[28%]" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span>Twitter / X</span>
              <span className="font-semibold text-[var(--text)]">14%</span>
            </div>
            <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--muted)] h-full w-[14%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Manuscripts Summary */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-title font-medium text-[18px] text-[var(--text)]">
            Manuscripts
          </h3>
          <Link href="/admin/books" className="text-[13px] text-[var(--accent)] hover:underline">
            Manage all ({books.length}) →
          </Link>
        </div>
        <div className="text-[14px] text-[var(--muted)] mb-4">
          {books.length} books · {totalChapters} chapters · {formatWords(totalWords)} total words
        </div>
        <div className="divide-y divide-[var(--border)]">
          {books.map((b) => (
            <div key={b.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text)]">{b.title}</div>
                <div className="text-[12px] text-[var(--muted)]">
                  {b.genre} · {b.chapters?.length || 0} chapters
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/books/${b.slug}`}
                  target="_blank"
                  className="px-2.5 py-1 text-[12px] rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                >
                  View live
                </Link>
                <Link
                  href={`/admin/books/${b.id}`}
                  className="px-2.5 py-1 text-[12px] rounded border border-[var(--border)] text-[var(--text)] hover:border-[var(--text)]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
