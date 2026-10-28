import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { getSupabasePublic } from '@/lib/supabase-server';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (token) {
    const supabase = getSupabasePublic();
    if (supabase) {
      await supabase.from('subscribers').delete().eq('token', token);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-5 py-16 sm:py-24 text-center">
        <div className="bg-[var(--surface)] p-8 sm:p-12 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow)]">
          <h1 className="font-serif-title font-medium text-[26px] text-[var(--text)] mb-3">
            You Have Been Unsubscribed
          </h1>
          <p className="text-[15.5px] leading-relaxed text-[var(--muted)] mb-8">
            You will no longer receive chapter release emails from Pages by Nana. You can always visit and read anytime. All books remain completely free and open.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-[14px] inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
