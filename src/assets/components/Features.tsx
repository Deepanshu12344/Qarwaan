import { ShieldCheck, Sparkles, TimerReset } from 'lucide-react';

const featureVisuals = [
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2256306/pexels-photo-2256306.jpeg?auto=compress&cs=tinysrgb&w=900',
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="bt-kicker text-[#8c7c72]">How We Work</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1f1a17] md:text-4xl">
            Trip planning without the stress
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <article className="rounded-[26px] border border-[#e0d3c5] bg-[#f7f1ea] p-6">
            <img src={featureVisuals[0]} alt="Planned itinerary visual" loading="lazy" className="h-32 w-full rounded-[20px] object-cover" />
            <div className="mt-6">
              <div className="mb-4 inline-flex rounded-full border border-[#d86b4a]/40 p-3">
                <Sparkles className="h-5 w-5 text-[#d86b4a]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1f1a17]">Handcrafted Itineraries</h3>
              <p className="text-sm leading-6 text-[#6b5f57]">
                Every journey includes clear daily flow, on-ground logistics, and time for spontaneity.
              </p>
            </div>
          </article>

          <article className="rounded-[26px] border border-[#e0d3c5] bg-white p-6 shadow-[0_22px_44px_rgba(31,26,23,0.12)]">
            <img src={featureVisuals[1]} alt="Trip replanning visual" loading="lazy" className="h-32 w-full rounded-[20px] object-cover" />
            <div className="mt-6">
              <div className="mb-4 inline-flex rounded-full border border-[#d86b4a]/40 p-3">
                <TimerReset className="h-5 w-5 text-[#d86b4a]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1f1a17]">Quick Replanning</h3>
              <p className="text-sm leading-6 text-[#6b5f57]">
                Shift dates or reshape the duration and our team recalibrates the route in hours.
              </p>
            </div>
          </article>

          <article className="rounded-[26px] border border-[#e0d3c5] bg-[#f7f1ea] p-6">
            <img src={featureVisuals[2]} alt="On-ground travel support visual" loading="lazy" className="h-32 w-full rounded-[20px] object-cover" />
            <div className="mt-6">
              <div className="mb-4 inline-flex rounded-full border border-[#d86b4a]/40 p-3">
                <ShieldCheck className="h-5 w-5 text-[#d86b4a]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1f1a17]">Reliable On-Ground Support</h3>
              <p className="text-sm leading-6 text-[#6b5f57]">
                Dedicated coordinators stay with you before departure and throughout the trip.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
