import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GUIDE_ARTICLES, type GuideType } from '../../data/guides';

const tabs: Array<{ key: 'all' | GuideType; label: string }> = [
  { key: 'all', label: 'All Guides' },
  { key: 'destination', label: 'Destination' },
  { key: 'city', label: 'City' },
  { key: 'season', label: 'Season' },
];

export default function GuidesPage() {
  const [activeTab, setActiveTab] = useState<'all' | GuideType>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return GUIDE_ARTICLES.filter((item) => {
      if (activeTab !== 'all' && item.type !== activeTab) return false;
      if (!term) return true;
      const hay = `${item.title} ${item.description} ${item.bestFor.join(' ')}`.toLowerCase();
      return hay.includes(term);
    });
  }, [activeTab, search]);

  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Travel Guides',
      description: 'Destination, city and seasonal travel planning guides.',
      hasPart: filtered.map((item) => ({
        '@type': 'Article',
        headline: item.title,
        url: `/discover/${item.type}/${item.slug}`,
      })),
    }),
    [filtered]
  );

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="relative overflow-hidden bg-[#112211] pb-20">
        <Header />
        <div className="container mx-auto px-5 pt-36 text-white md:px-8">
          <h1 className="text-4xl font-extrabold md:text-5xl">Travel Guides</h1>
          <p className="mt-3 max-w-2xl text-white/85">Find destination insights, city planning notes, and seasonal booking strategy in one place.</p>
        </div>
      </div>

      <main className="container mx-auto px-5 py-8 pb-20 md:px-8">
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides"
              className="rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === tab.key ? 'bg-[#112211] text-white' : 'border border-[#112211] text-[#112211]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <article key={`${guide.type}-${guide.slug}`} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <img src={guide.heroImage} alt={guide.title} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3e7d69]">{guide.type} • {guide.readTimeMinutes} min read</p>
                <h2 className="mt-2 text-xl font-bold text-[#112211]">{guide.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{guide.description}</p>
                <Link to={`/discover/${guide.type}/${guide.slug}`} className="mt-3 inline-block text-sm font-semibold text-[#112211] underline">
                  Read guide
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
