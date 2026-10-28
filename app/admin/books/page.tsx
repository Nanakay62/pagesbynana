import Link from 'next/link';
import { getAllAdminBooks } from '@/lib/supabase-server';
import { formatWords } from '@/lib/reading-time';
import { Plus, BookOpen, FileUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBooksPage() {
  const books = await getAllAdminBooks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
            Books & Serial Fiction
          </h1>
          <p className="text-[13.5px] text-[var(--muted)]">
            Create, edit, or archive your books and their chapter releases.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13.5px] font-medium hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            <FileUp className="w-4 h-4 text-[var(--accent)]" /> Import Word
          </Link>
          <Link
            href="/admin/books/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13.5px] font-medium hover:brightness-105 transition-all hover:no-underline"
          >
            <Plus className="w-4 h-4" /> New book
          </Link>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="p-12 text-center rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-serif-title font-medium text-[20px] mb-2">No books found in database</h2>
          <p className="text-[14px] text-[var(--muted)] max-w-md mx-auto mb-6">
            Get started by creating your first book details or importing your Word manuscript directly.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/admin/books/new"
              className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13.5px] font-medium hover:brightness-105"
            >
              Create first book
            </Link>
            <Link
              href="/admin/import"
              className="px-4 py-2 rounded border border-[var(--border)] text-[13.5px] text-[var(--text)] hover:border-[var(--text)]"
            >
              Import .docx manuscript
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[var(--bg)] border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Genre</th>
                <th className="py-3 px-4">Chapters</th>
                <th className="py-3 px-4">Words</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {books.map((b) => {
                const chaps = b.chapters?.length || 0;
                const words = b.chapters?.reduce((sum, c) => sum + (c.word_count || 0), 0) || 0;

                return (
                  <tr key={b.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">
                      {b.title}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">{b.genre || '-'}</td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">{chaps}</td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">{formatWords(words)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          b.status === 'completed'
                            ? 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
                            : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/books/${b.slug}`}
                        target="_blank"
                        className="text-[12.5px] text-[var(--muted)] hover:text-[var(--text)] hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/books/${b.id}`}
                        className="text-[12.5px] text-[var(--accent)] font-medium hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
