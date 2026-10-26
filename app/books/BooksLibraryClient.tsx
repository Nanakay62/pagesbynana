'use client';

import { useState, useMemo } from 'react';
import { Book } from '@/lib/types';
import BookCard from '@/components/library/BookCard';
import { Search } from 'lucide-react';

export default function BooksLibraryClient({ books }: { books: Book[] }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Filter tab
      const matchesTab =
        activeFilter === 'all' ||
        b.status === activeFilter ||
        b.genre === activeFilter;

      // Text query
      const q = query.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.synopsis && b.synopsis.toLowerCase().includes(q)) ||
        (b.genre && b.genre.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesTab && matchesSearch;
    });
  }, [books, query, activeFilter]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
    { id: 'Literary Fantasy', label: 'Literary Fantasy' },
    { id: 'Literary Fiction', label: 'Literary Fiction' },
    { id: 'Historical Fiction', label: 'Historical Fiction' },
  ];

  return (
    <div>
      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, or keyword..."
            aria-label="Search books"
            className="w-full pl-9 pr-4 py-2 text-[14px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors ${
                activeFilter === f.id
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                  : 'border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredBooks.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
          <p className="text-[16px]">No stories found matching your filter.</p>
          <button
            onClick={() => {
              setQuery('');
              setActiveFilter('all');
            }}
            className="mt-3 text-[14px] text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
