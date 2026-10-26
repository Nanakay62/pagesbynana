'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetEmail = 'nanakwamedickson@outlook.com';
    if (email.toLowerCase().trim() !== targetEmail.toLowerCase()) {
      setError(`Access denied. Only the author email (${targetEmail}) is permitted.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/admin');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] hover:no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Pages by Nana
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>

          <h1 className="font-serif-title font-medium text-[24px] text-center text-[var(--text)] mb-2">
            Author Sign-in
          </h1>
          <p className="text-[13.5px] text-[var(--muted)] text-center mb-6">
            Enter your allowlisted email address to access the administration panel.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[13px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase font-semibold tracking-wider text-[var(--muted)] mb-1.5">
                Author Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nanakwamedickson@outlook.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14px] hover:brightness-105 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying author session...' : 'Sign in with Magic Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
