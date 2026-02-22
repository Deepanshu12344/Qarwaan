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

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
  '/carousel1.png',
  'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative h-[500px] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative h-full flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-2 font-light tracking-wide">Helping Others</p>
        <h1 className="text-6xl font-bold mb-4 tracking-wide">LIVE & TRAVEL</h1>
        <p className="text-sm font-light">Special offers to suit your plan</p>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
