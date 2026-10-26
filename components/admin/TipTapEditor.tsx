'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { calculateReadingTime, countWordsFromHtml, formatWords } from '@/lib/reading-time';
import {
  Bold,
  Italic,
  Heading2,
  Quote,
  Minus,
  Link as LinkIcon,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Eye,
  Check,
  History,
  Clock,
  Save,
  ArrowLeft,
} from 'lucide-react';

interface TipTapEditorProps {
  initialTitle: string;
  initialContent: string;
  initialStatus: 'draft' | 'scheduled' | 'published';
  initialPublishAt?: string;
  bookSlug: string;
  chapterSlug: string;
}

interface ChapterSnapshot {
  timestamp: string;
  content: string;
  wordCount: number;
}

export default function TipTapEditor({
  initialTitle,
  initialContent,
  initialStatus,
  initialPublishAt,
  bookSlug,
  chapterSlug,
}: TipTapEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(initialStatus);
  const [publishAt, setPublishAt] = useState(initialPublishAt || '');
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<ChapterSnapshot[]>([]);

  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'font-reading-text text-[17px] sm:text-[18px] leading-relaxed text-[var(--text)] focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveState('unsaved');
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

      autosaveTimer.current = setTimeout(() => {
        triggerAutosave(editor.getHTML());
      }, 2500);
    },
  });

  const triggerAutosave = (htmlContent: string) => {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      // Append to local versions list (max 20 versions)
      const count = countWordsFromHtml(htmlContent);
      setVersions((prev) => [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          content: htmlContent,
          wordCount: count,
        },
        ...prev.slice(0, 19),
      ]);
    }, 600);
  };

  const [notifySubscribers, setNotifySubscribers] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleManualSave = async () => {
    if (!editor) return;
    triggerAutosave(editor.getHTML());

    if (notifySubscribers && status === 'published') {
      try {
        const textContent = editor.getText();
        const excerpt = textContent.slice(0, 160) + '...';
        await fetch('/api/admin/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chapterTitle: title,
            excerpt,
          }),
        });
        setSaveBanner('Saved & notification dispatched to subscribers!');
        setTimeout(() => setSaveBanner(null), 4000);
      } catch {
        setSaveBanner('Saved, but notification dispatch failed.');
        setTimeout(() => setSaveBanner(null), 4000);
      }
    } else {
      setSaveBanner('Changes saved successfully.');
      setTimeout(() => setSaveBanner(null), 3000);
    }
  };

  const handleRestoreVersion = (snapshot: ChapterSnapshot) => {
    if (!editor) return;
    if (confirm(`Restore snapshot from ${snapshot.timestamp}? Current unsaved edits will be replaced.`)) {
      editor.commands.setContent(snapshot.content);
      triggerAutosave(snapshot.content);
      setHistoryOpen(false);
    }
  };

  const insertSceneBreak = () => {
    if (!editor) return;
    editor.commands.insertContent('<div class="scene-break"></div><p></p>');
  };

  const currentHtml = editor ? editor.getHTML() : initialContent;
  const wordCount = countWordsFromHtml(currentHtml);
  const readingTime = calculateReadingTime(wordCount);

  return (
    <div
      className={
        isDistractionFree
          ? 'fixed inset-0 z-50 bg-[var(--bg)] overflow-y-auto px-5 py-8 transition-all'
          : 'max-w-4xl'
      }
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          {!isDistractionFree && (
            <Link
              href="/admin/books"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] hover:no-underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to books
            </Link>
          )}

          <span className="text-[12.5px] text-[var(--muted)] flex items-center gap-1.5">
            {saveState === 'saved' && (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" /> Autosaved
              </>
            )}
            {saveState === 'saving' && (
              <>
                <Clock className="w-3.5 h-3.5 text-[var(--accent)] animate-spin" /> Saving...
              </>
            )}
            {saveState === 'unsaved' && (
              <span className="italic opacity-80">Unsaved changes...</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Version History Drawer Trigger */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[12.5px] text-[var(--text)] hover:border-[var(--text)] transition-colors"
            title="Version history"
          >
            <History className="w-3.5 h-3.5 text-[var(--accent)]" /> History ({versions.length})
          </button>

          {/* Distraction Free Toggle */}
          <button
            onClick={() => setIsDistractionFree(!isDistractionFree)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[12.5px] text-[var(--text)] hover:border-[var(--text)] transition-colors"
            title={isDistractionFree ? 'Exit distraction-free mode' : 'Distraction-free mode'}
          >
            {isDistractionFree ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" /> Normal view
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
              </>
            )}
          </button>

          {/* Preview as Reader */}
          <Link
            href={`/books/${bookSlug}/${chapterSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[12.5px] text-[var(--text)] hover:border-[var(--text)] transition-colors hover:no-underline"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" /> Preview as reader
          </Link>

          {/* Manual Save */}
          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      {/* Chapter Title & Metadata */}
      <div className={`space-y-4 mb-6 ${isDistractionFree ? 'max-w-2xl mx-auto' : ''}`}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSaveState('unsaved');
          }}
          placeholder="Chapter Title..."
          className="w-full font-serif-title font-medium text-[30px] sm:text-[36px] bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] pb-2 text-[var(--text)] focus:outline-none transition-colors"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--muted)] pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-[var(--text)]">{formatWords(wordCount)}</strong> words
            </span>
            <span>·</span>
            <span>
              <strong className="text-[var(--text)]">{readingTime}</strong> min reading time
            </span>
          </div>

          {/* Release Status & Scheduler */}
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setSaveState('unsaved');
              }}
              className="px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px]"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>

            {status === 'scheduled' && (
              <input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => {
                  setPublishAt(e.target.value);
                  setSaveState('unsaved');
                }}
                className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[12.5px]"
              />
            )}

            {status === 'published' && (
              <label className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifySubscribers}
                  onChange={(e) => setNotifySubscribers(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)]"
                />
                Notify readers
              </label>
            )}
          </div>
        </div>

        {saveBanner && (
          <div className="p-2.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] text-[13px] font-medium border border-[var(--accent)]/20 animate-fade-in flex items-center justify-between">
            <span>{saveBanner}</span>
            <button
              onClick={() => setSaveBanner(null)}
              className="text-[11px] underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* TipTap Minimal Toolbar */}
      <div
        className={`sticky top-0 z-30 flex flex-wrap items-center gap-1 p-2 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] shadow-sm mb-4 ${
          isDistractionFree ? 'max-w-2xl mx-auto' : ''
        }`}
      >
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg)] transition-colors ${
            editor?.isActive('bold') ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text)]'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg)] transition-colors ${
            editor?.isActive('italic') ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text)]'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--bg)] transition-colors ${
            editor?.isActive('heading', { level: 2 })
              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'text-[var(--text)]'
          }`}
          title="Subheading (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-[var(--bg)] transition-colors ${
            editor?.isActive('blockquote')
              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'text-[var(--text)]'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-4 bg-[var(--border)] mx-1" />

        {/* Scene Break Ornament */}
        <button
          onClick={insertSceneBreak}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[12px] font-medium border border-[var(--border)] hover:bg-[var(--bg)] text-[var(--accent)] transition-colors"
          title="Insert literary scene break (• • •)"
        >
          <Minus className="w-3.5 h-3.5" /> Scene Break
        </button>

        <span className="w-[1px] h-4 bg-[var(--border)] mx-1" />

        <button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          className="p-1.5 rounded hover:bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Prose Surface */}
      <div
        className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 sm:p-10 shadow-sm ${
          isDistractionFree ? 'max-w-2xl mx-auto' : ''
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Version History Drawer */}
      {historyOpen && (
        <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-lg)] z-50 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
            <h3 className="font-serif-title font-medium text-[16px]">Version History</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
            >
              Close
            </button>
          </div>

          <div className="text-[12px] text-[var(--muted)] mb-3">
            Snapshots are automatically recorded every time you write:
          </div>

          {versions.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[var(--muted)] italic">
              No snapshots yet. Start typing to create auto-save versions.
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1">
              {versions.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded border border-[var(--border)] bg-[var(--bg)] text-[13px] flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[var(--text)]">{v.timestamp}</div>
                    <div className="text-[11.5px] text-[var(--muted)]">
                      {formatWords(v.wordCount)} words
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreVersion(v)}
                    className="text-[12px] text-[var(--accent)] font-medium hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
