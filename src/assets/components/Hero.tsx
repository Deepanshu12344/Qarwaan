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
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/main_hero_vid.MP4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative mx-auto flex min-h-[100vh] max-w-[1200px] flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-4xl font-semibold tracking-[0.04em] md:text-6xl">
          Your Journey Starts Here
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/80 md:text-xl">
          Effortless, personal journeys to iconic and hidden places
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/trip-finder" className="q-button q-button-outline-light">
            Explore Our Trips
          </Link>
          <a
            href="/enquire"
            className="q-button !bg-[#004643] !text-white !border-[#004643] hover:!bg-[#004643] hover:!text-white hover:!border-[#004643]"
          >
            Upcoming Trips
          </a>
        </div>
      </div>

    </section>
  );
}
