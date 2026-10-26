'use client';

type EventType = 'book_open' | 'chapter_read' | 'chapter_complete' | 'donate_click';

interface TrackOptions {
  bookId?: string;
  chapterId?: string;
}

/**
 * Get or create an anonymous session ID stored only in sessionStorage.
 * Cleared automatically when the browser tab is closed.
 */
function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') return '';

  const KEY = 'pn_session_id';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = 's_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

/**
 * Check if current user is an author admin or bot
 */
function shouldIgnoreTracking(): boolean {
  if (typeof window === 'undefined') return true;

  // Skip bots
  if (/bot|crawl|spider|slurp|facebookexternalhit|bingpreview/i.test(navigator.userAgent)) {
    return true;
  }

  // Skip if author is logged in (sessionStorage / localStorage flag)
  if (localStorage.getItem('pn_is_admin') === 'true') {
    return true;
  }

  return false;
}

/**
 * Dispatch privacy-friendly event via navigator.sendBeacon
 */
export function trackEvent(type: EventType, options: TrackOptions = {}) {
  if (shouldIgnoreTracking()) return;

  const sessionId = getAnonymousSessionId();
  const payload = JSON.stringify({
    type,
    book_id: options.bookId || null,
    chapter_id: options.chapterId || null,
    session_id: sessionId,
  });

  const url = '/api/events';

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else if (typeof fetch !== 'undefined') {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}
