const logos = ['Travel + Leisure', 'Forbes', 'Condé Nast Traveler', 'BBC Travel'];

export default function MediaLogos() {
  return (
    <section className="bg-[#f2f2f2] py-16 md:py-[100px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 text-sm uppercase tracking-[0.25em] text-gray-500">
        {logos.map((logo) => (
          <span key={logo}>{logo}</span>
        ))}
      </div>
    </section>
  );
}
