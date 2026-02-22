import { ShieldCheck, Sparkles, TimerReset } from 'lucide-react';

const featureVisuals = [
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2256306/pexels-photo-2256306.jpeg?auto=compress&cs=tinysrgb&w=900',
];

export default function Features() {
  return (
    <section className="container mx-auto px-5 py-16 md:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3e7d69]">How We Work</p>
        <h2 className="mt-3 text-3xl font-bold text-[#112211] md:text-4xl">Trip Planning Without The Stress</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-[#d5ede5] bg-[#f4faf8]">
          <img src={featureVisuals[0]} alt="Planned itinerary visual" className="h-36 w-full object-cover" />
          <div className="p-6">
          <div className="mb-4 inline-flex rounded-full bg-[#8DD3BB]/35 p-3">
            <Sparkles className="h-5 w-5 text-[#114436]" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#112211]">Handcrafted Itineraries</h3>
          <p className="text-sm leading-6 text-[#3d4f47]">
            Every package includes activities, local transport, and practical timing so travelers know exactly what to expect.
          </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-[#d5ede5] bg-white shadow-[0_18px_38px_rgba(17,34,17,0.08)]">
          <img src={featureVisuals[1]} alt="Trip replanning visual" className="h-36 w-full object-cover" />
          <div className="p-6">
          <div className="mb-4 inline-flex rounded-full bg-[#8DD3BB]/35 p-3">
            <TimerReset className="h-5 w-5 text-[#114436]" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#112211]">Quick Replanning</h3>
          <p className="text-sm leading-6 text-[#3d4f47]">
            Need to switch dates or shorten from 7 to 5 days? Our team updates your trip plan with transparent cost impact.
          </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-[#d5ede5] bg-[#f4faf8]">
          <img src={featureVisuals[2]} alt="On-ground travel support visual" className="h-36 w-full object-cover" />
          <div className="p-6">
          <div className="mb-4 inline-flex rounded-full bg-[#8DD3BB]/35 p-3">
            <ShieldCheck className="h-5 w-5 text-[#114436]" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#112211]">Reliable On-Ground Support</h3>
          <p className="text-sm leading-6 text-[#3d4f47]">
            Dedicated coordinators help before and during the trip for smooth check-ins, transfers, and activity scheduling.
          </p>
          </div>
        </article>
      </div>
    </section>
  );
}
