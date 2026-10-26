'use client';

import { useEffect, useState } from 'react';

interface ReaderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReaderSettings({ isOpen, onClose }: ReaderSettingsProps) {
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('serif');
  const [size, setSize] = useState('19');
  const [spacing, setSpacing] = useState('1.75');
  const [dropcap, setDropcap] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cl_theme') || 'light';
    const savedFont = localStorage.getItem('cl_font') || 'serif';
    const savedSize = localStorage.getItem('cl_size') || '19';
    const savedSpacing = localStorage.getItem('cl_spacing') || '1.75';
    const savedDropcap = localStorage.getItem('cl_dropcap') === 'true';

    setTheme(savedTheme);
    setFont(savedFont);
    setSize(savedSize);
    setSpacing(savedSpacing);
    setDropcap(savedDropcap);

    applyStyles(savedFont, savedSize, savedSpacing, savedDropcap);
  }, []);

  const applyStyles = (f: string, s: string, sp: string, dc: boolean) => {
    const root = document.documentElement;
    const fontMap: Record<string, string> = {
      serif: 'var(--font-reading)',
      sans: 'var(--font-ui)',
      dys: 'var(--font-dys)',
    };
    root.style.setProperty('--reading-family', fontMap[f] || fontMap.serif);
    root.style.setProperty('--reading-size', `${s}px`);
    root.style.setProperty('--reading-lh', sp);

    const rc = document.querySelector('.reader-content');
    if (rc) {
      if (dc) rc.classList.add('dropcap');
      else rc.classList.remove('dropcap');
    }
  };

  const updateTheme = (val: string) => {
    let effective = val;
    if (val === 'auto') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effective);
    localStorage.setItem('cl_theme', val);
    setTheme(val);
  };

  const updateFont = (val: string) => {
    localStorage.setItem('cl_font', val);
    setFont(val);
    applyStyles(val, size, spacing, dropcap);
  };

  const updateSize = (val: string) => {
    localStorage.setItem('cl_size', val);
    setSize(val);
    applyStyles(font, val, spacing, dropcap);
  };

  const updateSpacing = (val: string) => {
    localStorage.setItem('cl_spacing', val);
    setSpacing(val);
    applyStyles(font, size, val, dropcap);
  };

  const updateDropcap = (val: boolean) => {
    localStorage.setItem('cl_dropcap', String(val));
    setDropcap(val);
    applyStyles(font, size, spacing, val);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed top-16 right-4 sm:right-8 w-80 max-w-[calc(100vw-32px)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-5 z-50 text-[var(--text)] transition-all"
      aria-label="Reading typography and theme settings"
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
        <h4 className="font-serif-title font-medium text-[16px]">Reading settings</h4>
        <button
          onClick={onClose}
          className="text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
        >
          Close
        </button>
      </div>

      {/* Theme */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Theme
        </div>
        <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded p-1 gap-1">
          {['light', 'sepia', 'dark', 'auto'].map((t) => (
            <button
              key={t}
              onClick={() => updateTheme(t)}
              className={`flex-1 py-1.5 text-[12.5px] rounded capitalize transition-all ${
                theme === t
                  ? 'bg-[var(--surface)] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Typeface
        </div>
        <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded p-1 gap-1">
          {[
            { id: 'serif', label: 'Serif' },
            { id: 'sans', label: 'Sans' },
            { id: 'dys', label: 'Dyslexic' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateFont(item.id)}
              className={`flex-1 py-1.5 text-[12.5px] rounded transition-all ${
                font === item.id
                  ? 'bg-[var(--surface)] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Font Size
        </div>
        <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded p-1 gap-1">
          {['16', '18', '19', '21', '24'].map((s, idx) => (
            <button
              key={s}
              onClick={() => updateSize(s)}
              className={`flex-1 py-1 text-[12px] rounded transition-all ${
                size === s
                  ? 'bg-[var(--surface)] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {idx === 0 ? 'A−' : idx === 4 ? 'A+' : `A`}
            </button>
          ))}
        </div>
      </div>

      {/* Line Spacing */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Line Spacing
        </div>
        <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded p-1 gap-1">
          {[
            { val: '1.55', label: 'Cozy' },
            { val: '1.75', label: 'Normal' },
            { val: '1.95', label: 'Roomy' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => updateSpacing(item.val)}
              className={`flex-1 py-1 text-[12px] rounded transition-all ${
                spacing === item.val
                  ? 'bg-[var(--surface)] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Cap */}
      <div>
        <label className="flex items-center gap-2.5 text-[13.5px] cursor-pointer">
          <input
            type="checkbox"
            checked={dropcap}
            onChange={(e) => updateDropcap(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          Drop cap on first paragraph
        </label>
      </div>
    </aside>
  );
}
