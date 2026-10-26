'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '@/lib/sample-data';
import { Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pbn_settings');
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('pbn_settings', JSON.stringify(settings));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)] mb-2">
        Site Settings
      </h1>
      <p className="text-[13.5px] text-[var(--muted)] mb-8">
        Configure site identity, author attribution, and external Paystack / donation endpoints.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--surface)] p-6 sm:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="w-full px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14.5px] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14.5px] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <div className="font-serif-title font-medium text-[17px] text-[var(--text)] mb-4">
            Support & Donation Links
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
                Paystack Payment Page URL (Mobile Money & Cards)
              </label>
              <input
                type="url"
                value={settings.paystack_url}
                onChange={(e) => setSettings({ ...settings, paystack_url: e.target.value })}
                placeholder="https://paystack.com/pay/..."
                className="w-full px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
                Ko-fi URL
              </label>
              <input
                type="url"
                value={settings.kofi_url}
                onChange={(e) => setSettings({ ...settings, kofi_url: e.target.value })}
                placeholder="https://ko-fi.com/..."
                className="w-full px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
            Allowlisted Author Admin Email
          </label>
          <input
            type="email"
            value={settings.admin_email}
            disabled
            className="w-full px-4 py-2 rounded border border-[var(--border)] bg-[var(--bg)]/60 text-[var(--muted)] text-[14px] cursor-not-allowed"
          />
          <div className="text-[12px] text-[var(--muted)] mt-1">
            Configured via <code>ADMIN_EMAIL</code> environment variable.
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
          {saved ? (
            <span className="text-[13px] text-green-600 flex items-center gap-1 font-medium">
              <Check className="w-4 h-4" /> Settings saved successfully
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14px] hover:brightness-105 transition-all"
          >
            <Save className="w-4 h-4" /> Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
