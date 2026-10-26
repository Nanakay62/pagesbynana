import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import SupportLinks from '@/components/support/SupportLinks';

export const metadata = {
  title: 'Support the Author — Pages by Nana',
  description: 'Optional tips and donations via Paystack (Mobile Money / Cards) or Ko-fi.',
};

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[680px] w-full mx-auto px-5 py-12 sm:py-16">
        <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
          Support
        </div>
        <h1 className="font-serif-title font-normal text-[36px] sm:text-[42px] leading-tight text-[var(--text)] mb-4">
          Leave a small tip
        </h1>
        <p className="text-[16.5px] leading-[1.7] text-[var(--text)] mb-8">
          Every story here is completely free to read, and will stay that way. If a chapter brought you peace or stayed with you, and you would like to help the next one get written, you can leave an optional tip through the links below.
        </p>

        {/* Donation links with donate_click event tracking */}
        <SupportLinks />

        <p className="text-[14px] text-[var(--muted)] leading-relaxed mt-10 pt-6 border-t border-[var(--border)]">
          Thank you, sincerely. Every single tip is seen and appreciated, and goes directly into buying tea and carving out quiet hours for writing.
        </p>
      </main>
      <Footer />
    </>
  );
}
