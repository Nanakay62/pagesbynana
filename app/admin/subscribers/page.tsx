'use client';

import { useState } from 'react';
import { Download, Trash2, Mail, Send, CheckCircle, Bell, Users, Clock, ShieldCheck } from 'lucide-react';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([
    { id: '1', email: 'ama.osei@example.com', confirmed: true, date: 'Oct 14, 2026', book: 'The Lantern Keeper' },
    { id: '2', email: 'k.mensah@example.com', confirmed: true, date: 'Oct 17, 2026', book: 'All Books' },
    { id: '3', email: 'priya.r@example.com', confirmed: true, date: 'Oct 20, 2026', book: 'Ember & Ink' },
    { id: '4', email: 'joseph.a@example.com', confirmed: true, date: 'Oct 22, 2026', book: 'All Books' },
    { id: '5', email: 'lena.k@example.com', confirmed: true, date: 'Oct 24, 2026', book: 'The Lantern Keeper' },
    { id: '6', email: 'kwabena.d@example.com', confirmed: false, date: 'Oct 26, 2026', book: 'The Lantern Keeper' },
  ]);

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('nanakwamedickson@outlook.com');
  const [customChapterTitle, setCustomChapterTitle] = useState('The Flickering (Chapter 1)');

  const confirmedCount = subscribers.filter((s) => s.confirmed).length;
  const pendingCount = subscribers.length - confirmedCount;
  const rate = Math.round((confirmedCount / subscribers.length) * 100);

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Confirmed,BookInterest,SubscribedDate']
        .concat(subscribers.map((s) => `${s.email},${s.confirmed},"${s.book}",${s.date}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pages_by_nana_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeSubscriber = (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleBroadcast = async (isTest: boolean) => {
    setIsBroadcasting(true);
    setBroadcastStatus(null);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: 'b0000001-0000-0000-0000-000000000001',
          chapterTitle: customChapterTitle,
          testEmail: isTest ? testEmail : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBroadcastStatus(
          isTest
            ? `Test notification dispatched to ${testEmail}!`
            : `Notification successfully broadcast to ${data.recipientsCount} confirmed reader(s)!`
        );
      } else {
        setBroadcastStatus(`Error: ${data.error || 'Failed to dispatch'}`);
      }
    } catch {
      setBroadcastStatus('Network error while dispatching notification');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)]">
            Email Subscribers
          </h1>
          <p className="text-[13.5px] text-[var(--muted)]">
            Readers subscribed to new chapter releases via double opt-in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" /> Send Chapter Alert
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors"
          >
            <Download className="w-4 h-4 text-[var(--accent)]" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[12px] uppercase font-semibold text-[var(--muted)] mb-1">
            <Users className="w-3.5 h-3.5" /> Total Readers
          </div>
          <div className="text-[24px] font-medium text-[var(--text)] font-serif-title">
            {subscribers.length}
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[12px] uppercase font-semibold text-[var(--muted)] mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Active (Confirmed)
          </div>
          <div className="text-[24px] font-medium text-green-700 font-serif-title">
            {confirmedCount}
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[12px] uppercase font-semibold text-[var(--muted)] mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Verification
          </div>
          <div className="text-[24px] font-medium text-amber-700 font-serif-title">
            {pendingCount}
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[12px] uppercase font-semibold text-[var(--muted)] mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> Double Opt-In
          </div>
          <div className="text-[24px] font-medium text-[var(--text)] font-serif-title">
            {rate}%
          </div>
        </div>
      </div>

      {/* Broadcast Modal / Card */}
      {showBroadcastModal && (
        <div className="mb-8 p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border-2 border-[var(--accent)] shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
            <div className="flex items-center gap-2 font-serif-title font-medium text-[18px] text-[var(--text)]">
              <Send className="w-4 h-4 text-[var(--accent)]" /> Broadcast New Chapter Release
            </div>
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="text-[13px] text-[var(--muted)] hover:text-[var(--text)]"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase text-[var(--muted)] mb-1">
                Chapter Title to Announce
              </label>
              <input
                type="text"
                value={customChapterTitle}
                onChange={(e) => setCustomChapterTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold uppercase text-[var(--muted)] mb-1">
                  Test Email Recipient
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-[14px]"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={() => handleBroadcast(true)}
                  className="flex-1 px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] text-[13px] font-medium hover:border-[var(--text)] transition-colors disabled:opacity-50"
                >
                  Send Test Preview
                </button>
                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={() => handleBroadcast(false)}
                  className="flex-1 px-4 py-2 rounded bg-[var(--accent)] text-[var(--accent-contrast)] text-[13px] font-medium hover:brightness-105 transition-all disabled:opacity-50"
                >
                  Broadcast to All ({confirmedCount})
                </button>
              </div>
            </div>

            {broadcastStatus && (
              <div className="p-3 rounded bg-[var(--bg)] border border-[var(--border)] text-[13.5px] font-medium text-[var(--text)]">
                {broadcastStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[var(--bg)] border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Follows</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                <td className="py-3 px-4 font-medium text-[var(--text)] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--muted)]" />
                  {s.email}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      s.confirmed
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]'
                    }`}
                  >
                    {s.confirmed ? 'Confirmed' : 'Pending verification'}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--muted)] text-[13px]">{s.book}</td>
                <td className="py-3 px-4 text-[var(--muted)] text-[13px]">{s.date}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => removeSubscriber(s.id)}
                    className="text-[var(--muted)] hover:text-red-600 transition-colors"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
