'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExtractedChapter } from '@/lib/import-docx';
import { calculateReadingTime, formatWords } from '@/lib/reading-time';
import {
  FileUp,
  BookOpen,
  Merge,
  Trash2,
  Check,
  AlertCircle,
  Scissors,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

export default function WordImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [chapters, setChapters] = useState<ExtractedChapter[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [saveStatus, setSaveStatus] = useState<'draft' | 'published'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.books && data.books.length > 0) {
          setBooks(data.books);
          setSelectedBookId(data.books[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process manuscript');
      }

      setChapters(data.chapters || []);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsProcessing(false);
    }
  };

  // Demo manuscript loader for testing and preview verification
  const loadDemoManuscript = () => {
    setError('');
    setIsProcessing(true);
    setTimeout(() => {
      setChapters([
        {
          number: 1,
          title: 'The First Letter',
          slug: 'the-first-letter',
          word_count: 1540,
          preview:
            'I am writing to you because I do not know anyone else to write to, and because the sea is loud tonight...',
          content_html:
            '<p>I am writing to you because I do not know anyone else to write to, and because the sea is loud tonight and the sound of a pen on paper seems the only reasonable reply.</p><div class="scene-break"></div><p>My name is Adwoa. I am seventy-three years old.</p>',
        },
        {
          number: 2,
          title: 'The Green Awning',
          slug: 'the-green-awning',
          word_count: 1720,
          preview:
            'The secondhand shop is called, improbably, "Pages & Plums." The owner, a young man with kind eyes...',
          content_html:
            '<p>The secondhand shop is called, improbably, "Pages &amp; Plums." The owner, a young man with kind eyes and a persistent cold, does not question my visits.</p>',
        },
        {
          number: 3,
          title: 'The Salt Memory',
          slug: 'the-salt-memory',
          word_count: 1890,
          preview:
            'The third letter was written on a Sunday, when the rain was coming down against the kitchen glass...',
          content_html:
            '<p>The third letter was written on a Sunday, when the rain was coming down against the kitchen glass in long, deliberate strokes.</p>',
        },
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handleTitleChange = (idx: number, newTitle: string) => {
    setChapters((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, title: newTitle } : c))
    );
  };

  const handleMergeNext = (idx: number) => {
    if (idx >= chapters.length - 1) return;
    const current = chapters[idx];
    const next = chapters[idx + 1];

    const mergedContent = `${current.content_html}\n<div class="scene-break"></div>\n${next.content_html}`;
    const mergedWords = current.word_count + next.word_count;

    const updated = [...chapters];
    updated[idx] = {
      ...current,
      content_html: mergedContent,
      word_count: mergedWords,
      preview: `${current.preview} [Merged with ${next.title}]`,
    };
    updated.splice(idx + 1, 1);

    // Renumber
    setChapters(updated.map((c, i) => ({ ...c, number: i + 1 })));
  };

  const handleDelete = (idx: number) => {
    if (confirm(`Delete Chapter ${chapters[idx].number}: "${chapters[idx].title}"?`)) {
      const updated = chapters.filter((_, i) => i !== idx);
      setChapters(updated.map((c, i) => ({ ...c, number: i + 1 })));
    }
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= chapters.length) return;

    const updated = [...chapters];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setChapters(updated.map((c, i) => ({ ...c, number: i + 1 })));
  };

  const handleConfirmSave = async () => {
    if (!selectedBookId) {
      alert('Please select or create a book first before saving chapters.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookId,
          chapters,
          status: saveStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save chapters');
      }

      alert(`Successfully saved ${data.count || chapters.length} chapters to your book!`);
      router.push(`/admin/books/${selectedBookId}`);
    } catch (err: any) {
      alert(err.message || 'Error saving chapters');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif-title font-medium text-[28px] text-[var(--text)]">
            Word Manuscript Import
          </h1>
          <p className="text-[13.5px] text-[var(--muted)]">
            Upload a Microsoft Word (<code>.docx</code>) file to automatically extract, split, and format chapters.
          </p>
        </div>

        <button
          onClick={loadDemoManuscript}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[12.5px] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Load sample manuscript
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[13.5px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {chapters.length === 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          className="p-10 sm:p-14 rounded-[var(--radius-lg)] bg-[var(--surface)] border-2 border-dashed border-[var(--border)] text-center mb-8 shadow-sm transition-all hover:border-[var(--accent)]"
        >
          <div className="w-14 h-14 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-4">
            <FileUp className="w-7 h-7" />
          </div>
          <h2 className="font-serif-title font-medium text-[20px] text-[var(--text)] mb-2">
            Drag your Word manuscript here
          </h2>
          <p className="text-[14px] text-[var(--muted)] max-w-md mx-auto mb-6">
            Heading 1 & Heading 2 become chapter breaks. Scene breaks (<code>* * *</code>) are converted to literary dividers.
          </p>

          <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[14px] font-medium hover:brightness-105 transition-all cursor-pointer">
            {isProcessing ? 'Parsing manuscript...' : 'Choose .docx file'}
            <input
              type="file"
              accept=".docx"
              disabled={isProcessing}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Chapter Detection & Interactive Preview Screen */}
      {chapters.length > 0 && (
        <div className="space-y-6">
          {/* Target Book & Status Bar */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--muted)] mb-1">
                  Assign to Book
                </label>
                {books.length > 0 ? (
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13.5px] font-medium"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] text-amber-600 dark:text-amber-400">
                      No books found.
                    </span>
                    <Link
                      href="/admin/books/new"
                      target="_blank"
                      className="text-[12.5px] text-[var(--accent)] underline"
                    >
                      + Create book
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--muted)] mb-1">
                  Release Status
                </label>
                <select
                  value={saveStatus}
                  onChange={(e) => setSaveStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[13.5px] font-medium"
                >
                  <option value="draft">Save as Drafts</option>
                  <option value="published">Publish Immediately</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChapters([])}
                className="px-3 py-1.5 rounded border border-[var(--border)] text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
              >
                Clear
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13.5px] font-medium hover:brightness-105 transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSaving ? 'Saving...' : `Confirm & Save ${chapters.length} Chapters`}
              </button>
            </div>
          </div>

          {/* Chapters List */}
          <div className="space-y-3">
            <div className="text-[12px] uppercase tracking-wider font-semibold text-[var(--muted)] px-1">
              Detected Chapters ({chapters.length}) — Click title to rename, merge or delete as needed
            </div>

            {chapters.map((chap, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm transition-all hover:border-[var(--accent)]/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-serif-title text-[15px] text-[var(--muted)] font-semibold min-w-[24px]">
                      {chap.number}.
                    </span>

                    <input
                      type="text"
                      value={chap.title}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      className="font-serif-title font-medium text-[17px] text-[var(--text)] bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] focus:outline-none px-1 py-0.5 rounded flex-1 max-w-md"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[12.5px] text-[var(--muted)]">
                    <span>{formatWords(chap.word_count)} words</span>
                    <span>·</span>
                    <span>{calculateReadingTime(chap.word_count)} min</span>

                    {/* Ordering buttons */}
                    <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:text-[var(--text)] disabled:opacity-30"
                        title="Move chapter up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === chapters.length - 1}
                        className="p-1 hover:text-[var(--text)] disabled:opacity-30"
                        title="Move chapter down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Merge button */}
                    {idx < chapters.length - 1 && (
                      <button
                        onClick={() => handleMergeNext(idx)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11.5px] border border-[var(--border)] hover:bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]"
                        title="Merge this chapter with the next chapter"
                      >
                        <Merge className="w-3 h-3" /> Merge with Ch. {chap.number + 1}
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1 text-[var(--muted)] hover:text-red-600 transition-colors"
                      title="Delete this chapter chunk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* First lines preview */}
                <p className="text-[13.5px] text-[var(--muted)] italic line-clamp-2 mt-1">
                  &ldquo;{chap.preview}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
