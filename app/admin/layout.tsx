import Link from 'next/link';
import { BookOpen, BarChart3, Settings, Users, FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | Pages by Nana',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] hover:no-underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </Link>
          </div>

          <div className="font-serif-title font-medium text-[19px] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            Author Admin
          </div>

          <nav className="space-y-1">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[var(--muted)] px-3 mb-1">
              Overview
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-[14px] text-[var(--text)] hover:bg-[var(--bg)] hover:no-underline transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-[var(--accent)]" /> Dashboard
            </Link>

            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[var(--muted)] px-3 pt-4 mb-1">
              Content
            </div>
            <Link
              href="/admin/books"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-[14px] text-[var(--text)] hover:bg-[var(--bg)] hover:no-underline transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[var(--accent)]" /> Books
            </Link>
            <Link
              href="/admin/import"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-[14px] text-[var(--text)] hover:bg-[var(--bg)] hover:no-underline transition-colors"
            >
              <FileText className="w-4 h-4 text-[var(--accent)]" /> Word import
            </Link>

            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[var(--muted)] px-3 pt-4 mb-1">
              System
            </div>
            <Link
              href="/admin/subscribers"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-[14px] text-[var(--text)] hover:bg-[var(--bg)] hover:no-underline transition-colors"
            >
              <Users className="w-4 h-4 text-[var(--accent)]" /> Subscribers
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded text-[14px] text-[var(--text)] hover:bg-[var(--bg)] hover:no-underline transition-colors"
            >
              <Settings className="w-4 h-4 text-[var(--accent)]" /> Settings
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-[var(--border)] text-[12px] text-[var(--muted)]">
          Signed in as <br />
          <strong className="text-[var(--text)]">nanakwamedickson@outlook.com</strong>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
