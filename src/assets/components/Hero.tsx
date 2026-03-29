// export default function Hero() {
//   return (
//     <section className="relative h-[500px] bg-gradient-to-b from-gray-900 to-gray-800">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: 'url(/carousel1.png)',
//           opacity: 0.6
//         }}
//       />
//       <div className="relative h-full flex flex-col items-center justify-center text-white">
//         <p className="text-lg mb-2 font-light tracking-wide">Helping Others</p>
//         <h1 className="text-6xl font-bold mb-4 tracking-wide">LIVE & TRAVEL</h1>
//         <p className="text-sm font-light">Special offers to suit your plan</p>
//       </div>
//     </section>
//   );
// }

import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/11.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative mx-auto flex min-h-[100vh] max-w-[1200px] flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-4xl font-semibold tracking-[0.04em] md:text-6xl">
          THE LUXURY TRAVEL EXPERTS
        </h1>
        <p className="mt-6 max-w-2xl text-sm uppercase text-white/80 md:text-base">
          Tailor-made journeys designed with editorial precision
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/enquire"
            className="q-button !bg-black !text-white !border-black hover:!bg-black hover:!text-white hover:!border-black"
          >
            Plan Your Trip
          </a>
          <Link to="/trip-finder" className="q-button q-button-outline-light">
            Explore Our Trips
          </Link>
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70"
      >
        Scroll
        <span className="h-8 w-[1px] bg-white/60" />
      </a>
    </section>
  );
}
