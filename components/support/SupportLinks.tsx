'use client';

import { trackEvent } from '@/lib/analytics';
import { Smartphone } from 'lucide-react';

export default function SupportLinks() {
  return (
    <div className="grid gap-4">
      {/* Mobile Money & Cards Primary */}
      <a
        href="https://paystack.com/pay/pagesbynana"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('donate_click')}
        className="flex items-center justify-between p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] shadow-[var(--shadow)] transition-all hover:no-underline group"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif-title font-medium text-[17px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Mobile Money & Cards
            </div>
            <div className="text-[13px] text-[var(--muted)] mt-0.5">
              Instant MTN MoMo, Telecel Cash, AT Money, Visa, & Mastercard
            </div>
          </div>
        </div>
        <span className="text-[14px] text-[var(--accent)] font-medium">Give →</span>
      </a>
    </div>
  );
}
