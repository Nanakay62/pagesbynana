'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [genre, setGenre] = useState('Literary Fiction');
  const [synopsis, setSynopsis] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverUrl, setCoverUrl] = useState('cover-a');
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          genre,
          synopsis,
          status,
          cover_url: coverUrl,
          is_featured: isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create book');
      }

      router.push(`/admin/books/${data.book.id}`);
    } catch (err: any) {
      setError(err.message || 'Error creating book');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/books"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to books
        </Link>
      </div>

      <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)] mb-2">
        Create New Book
      </h1>
      <p className="text-[13.5px] text-[var(--muted)] mb-8">
        Add the book details. Once created, you can write chapters or import a Word file.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[13.5px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--surface)] p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Book Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. The Lantern Keeper"
            className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-[14.5px]"
          />
        </div>

        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Slug (URL identifier) *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="the-lantern-keeper"
            className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] font-mono text-[13px] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Literary Fiction">Literary Fiction</option>
              <option value="Literary Fantasy">Literary Fantasy</option>
              <option value="Historical Fiction">Historical Fiction</option>
              <option value="Magical Realism">Magical Realism</option>
              <option value="Speculative">Speculative</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published / Ongoing</option>
              <option value="completed">Completed</option>
              <option value="hiatus">Hiatus</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Synopsis / Back Cover Blurb
          </label>
          <textarea
            rows={4}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="A short synopsis describing the story's heart..."
            className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14.5px] focus:outline-none focus:border-[var(--accent)] leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="memory, quiet, slow burn, Accra"
            className="w-full px-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Cover Style
          </label>
          <div className="grid grid-cols-4 gap-3">
            {['cover-a', 'cover-b', 'cover-c', 'cover-d'].map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCoverUrl(c)}
                className={`h-16 rounded border-2 transition-all ${c} ${
                  coverUrl === c ? 'border-[var(--accent)] scale-105 shadow-md' : 'border-transparent opacity-80'
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2.5 text-[14px] cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            Feature this book on the homepage hero
          </label>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3">
          <Link
            href="/admin/books"
            className="px-4 py-2 rounded border border-[var(--border)] text-[14px] text-[var(--muted)] hover:text-[var(--text)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14px] hover:brightness-105 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
}
