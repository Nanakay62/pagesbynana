'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import BookCover from '@/components/library/BookCover';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

export default function EditBookModal({
  book,
  isOpen,
  onClose,
}: {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(book.title);
  const [slug, setSlug] = useState(book.slug);
  const [genre, setGenre] = useState(book.genre || 'Literary Fiction');
  const [synopsis, setSynopsis] = useState(book.synopsis || '');
  const [status, setStatus] = useState(book.status);
  const [isFeatured, setIsFeatured] = useState(Boolean(book.is_featured));
  const [coverUrl, setCoverUrl] = useState(book.cover_url || 'cover-a');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload cover image');
      }

      setCoverUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Error uploading cover');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: book.id,
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
        throw new Error(data.error || 'Failed to update book');
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Error saving book details');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 className="font-serif-title font-medium text-[20px] text-[var(--text)]">
              Edit Book Details
            </h2>
            <p className="text-[12.5px] text-[var(--muted)]">
              Update cover art, metadata, and publication status.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[13px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-[13px] flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Book updated successfully! Refreshing...</span>
            </div>
          )}

          {/* Cover Image Section with Live Preview */}
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg)] border border-[var(--border)]">
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-3">
              Book Cover Artwork
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-5 items-start">
              {/* Preview */}
              <div className="w-[140px] mx-auto sm:mx-0">
                <BookCover
                  title={title || 'Book Title'}
                  coverStyle={coverUrl}
                  className="shadow-md"
                />
                <div className="text-[11px] text-center text-[var(--muted)] mt-1.5">
                  Current preview
                </div>
              </div>

              {/* Upload & controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[var(--text)] mb-1">
                    Upload new cover image
                  </label>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[13px] text-[var(--text)] hover:border-[var(--text)] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[var(--accent)]" />
                    <span>{isUploading ? 'Uploading image...' : 'Choose image file (JPG, PNG, WEBP)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[var(--text)] mb-1">
                    Or cover path / image URL
                  </label>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="/covers/the-silent-code.jpg or https://..."
                    className="w-full px-3 py-1.5 text-[13px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {/* Gradients preset fallback */}
                <div>
                  <span className="block text-[11px] text-[var(--muted)] mb-1.5">
                    Or pick a classic typographic gradient:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {['cover-a', 'cover-b', 'cover-c', 'cover-d'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCoverUrl(c)}
                        className={`h-10 rounded border-2 transition-all ${c} ${
                          coverUrl === c
                            ? 'border-[var(--accent)] scale-105 shadow-sm'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] font-mono text-[13px] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13.5px] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13.5px] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published / Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
              Synopsis
            </label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13.5px] focus:outline-none focus:border-[var(--accent)] leading-relaxed"
            />
          </div>

          <div>
            <label className="flex items-center gap-2.5 text-[13.5px] text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Feature this book on the homepage hero
            </label>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded border border-[var(--border)] text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-5 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

