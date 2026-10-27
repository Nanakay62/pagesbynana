import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllAdminBooks } from '@/lib/supabase-server';
import { ArrowLeft, Plus, Eye, Edit3 } from 'lucide-react';
import { calculateReadingTime, formatWords } from '@/lib/reading-time';

export const dynamic = 'force-dynamic';

export default async function AdminBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const books = await getAllAdminBooks();
  const book = books.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  const chapters = book.chapters || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/books"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to books
        </Link>
        <Link
          href={`/books/${book.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-[13px] text-[var(--accent)] hover:underline"
        >
          <Eye className="w-3.5 h-3.5" /> View public page
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif-title font-medium text-[28px] text-[var(--text)]">
            {book.title}
          </h1>
          <div className="text-[13.5px] text-[var(--muted)] mt-0.5">
            {book.genre} · <span className="capitalize">{book.status}</span> · {chapters.length} chapters
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/api/books/${book.slug}/export?format=markdown`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            Export .md
          </a>
          <a
            href={`/api/books/${book.slug}/export?format=html`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            Export .html
          </a>
          <Link
            href={`/admin/chapters/new?book_id=${book.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all hover:no-underline"
          >
            <Plus className="w-4 h-4" /> New chapter
          </Link>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm mb-8">
        <div className="p-4 bg-[var(--bg)] border-b border-[var(--border)] font-serif-title font-medium text-[16px] text-[var(--text)]">
          Manuscript Chapters
        </div>
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[var(--bg)]/50 border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Title</th>
              <th className="py-2.5 px-4">Words</th>
              <th className="py-2.5 px-4">Reading time</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {chapters.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                <td className="py-3 px-4 text-[var(--muted)]">{c.number}</td>
                <td className="py-3 px-4 font-medium text-[var(--text)]">{c.title}</td>
                <td className="py-3 px-4 text-[var(--muted)]">{formatWords(c.word_count)}</td>
                <td className="py-3 px-4 text-[var(--muted)]">
                  {calculateReadingTime(c.word_count)} min
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)]">
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    href={`/books/${book.slug}/${c.slug}`}
                    target="_blank"
                    className="text-[12.5px] text-[var(--muted)] hover:text-[var(--text)] hover:underline"
                  >
                    Read
                  </Link>
                  <Link
                    href={`/admin/chapters/${c.id}`}
                    className="text-[12.5px] text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
