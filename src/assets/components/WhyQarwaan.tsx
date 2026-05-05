import { Award, Headset, MapPinned, Sparkles, Trophy } from 'lucide-react';

const features = [
  { icon: Trophy, label: 'Award Winning Trips' },
  { icon: Sparkles, label: 'Handcrafted Itineraries' },
  { icon: MapPinned, label: 'No Planning Stress' },
  { icon: Headset, label: '24/7 Trip Support' },
  { icon: Award, label: 'Luxury Service' },
];

export default function WhyQarwaan() {
  return (
    <section className="bg-[#c95a2a] py-20 md:py-[100px] text-white">
      <div className="mx-auto max-w-[1200px] px-0 text-center">
        <p className="q-kicker text-white/80">Why QARWAAN</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl text-white">Why QARWAAN</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-5">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-4 text-sm text-white/85">
              <Icon className="h-8 w-8 text-white" strokeWidth={1} />
              <p className="uppercase tracking-[0.15em]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
