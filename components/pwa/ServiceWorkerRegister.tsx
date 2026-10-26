'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Pages by Nana ServiceWorker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('ServiceWorker registration skipped:', err);
          });
      });
    }

    // Monitor connectivity
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-[var(--shadow-lg)] flex items-center gap-2 animate-fade-in"
    >
      <WifiOff className="w-3.5 h-3.5 text-[var(--accent)]" />
      <span>Offline reading mode (cached chapters available)</span>
    </div>
  );
}
