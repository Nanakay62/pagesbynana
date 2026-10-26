import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: 'Privacy Notice — Pages by Nana',
  description: 'Cookie-free, distraction-free reading privacy policy.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[680px] w-full mx-auto px-5 py-12 sm:py-16">
        <div className="text-[12px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">
          Notice
        </div>
        <h1 className="font-serif-title font-normal text-[36px] sm:text-[42px] leading-tight text-[var(--text)] mb-6">
          Privacy & Cookies
        </h1>

        <div className="space-y-6 text-[16px] leading-[1.75] text-[var(--text)]">
          <p>
            <em>Pages by Nana</em> is built to be a calm, quiet, and private reading environment. We do not use third-party advertising cookies, and we do not track you across the internet.
          </p>

          <h2 className="font-serif-title font-medium text-[22px] text-[var(--text)] pt-4">
            What is stored on your device
          </h2>
          <p>
            The only data stored in your browser is strictly functional, stored in your device&apos;s local memory (<code>localStorage</code>) to make your reading experience effortless:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--muted)]">
            <li>
              <strong className="text-[var(--text)]">Visual & typography settings:</strong> Your chosen theme (Light, Sepia, Dark, Auto), font choice, font size, line spacing, and drop-cap preference.
            </li>
            <li>
              <strong className="text-[var(--text)]">Reading progress & position:</strong> The exact scroll position and chapter you were reading, so the site can return you to the exact spot when you come back.
            </li>
            <li>
              <strong className="text-[var(--text)]">Finished chapters:</strong> A simple checkbox marker so you know which chapters you have completed.
            </li>
          </ul>

          <h2 className="font-serif-title font-medium text-[22px] text-[var(--text)] pt-4">
            Analytics
          </h2>
          <p>
            We use privacy-respecting, cookie-free aggregate metrics (counting book opens and chapter completions) to know which stories are being enjoyed. No personal information or IP addresses are stored.
          </p>

          <p className="pt-4 text-[14.5px] text-[var(--muted)]">
            If you have questions about this policy, please reach out to{' '}
            <a href="mailto:nanakwamedickson@outlook.com" className="text-[var(--accent)] hover:underline">
              nanakwamedickson@outlook.com
            </a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
