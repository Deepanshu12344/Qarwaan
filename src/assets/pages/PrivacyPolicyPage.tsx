import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';
import { privacyPolicyContent, privacyPolicyHeadings } from '../data/privacyPolicy';

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy | Qarwaan',
    description: 'Read how Qarwaan collects, uses, shares, and protects your personal information.',
    path: '/privacy-policy',
  });

  return (
    <div className="min-h-screen bg-[#f6f4f1]">
      <Navbar variant="light" />
      <main className="pt-28">
        <section className="mx-auto max-w-[920px] px-4 pb-20">
          <div className="border border-black/10 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:px-10 md:py-14">
            <p className="text-[0.78rem] uppercase tracking-[0.3em] text-black/45">Legal</p>
            <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.16em] text-black md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base leading-8 text-black/65 md:text-[1.06rem]">
              The text below matches the privacy summary shown on our trip pages, presented here in a larger format for easier reading.
            </p>

            <div className="mt-10 space-y-4 border-t border-black/10 pt-8">
              {privacyPolicyContent.map((line) =>
                privacyPolicyHeadings.has(line) ? (
                  <h2
                    key={line}
                    className="pt-2 text-sm font-semibold uppercase tracking-[0.2em] text-black md:text-[0.84rem]"
                  >
                    {line}
                  </h2>
                ) : (
                  <p key={line} className="text-base leading-8 text-black/72 md:text-[1.06rem]">
                    {line}
                  </p>
                ),
              )}
            </div>

            <div className="mt-10 border-t border-black/10 pt-6">
              <Link to="/" className="q-button">
                Back To Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
