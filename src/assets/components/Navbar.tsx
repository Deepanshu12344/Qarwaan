import { useEffect, useRef, useState } from 'react';

const navItems = [
  { label: 'Destinations', href: '#journey' },
  { label: 'Experiences', href: '#trips' },
  { label: 'Stories', href: '#video' },
  { label: 'About', href: '#what-we-do' },
];

type NavbarVariant = 'light' | 'transparent';

export default function Navbar({ variant = 'transparent' }: { variant?: NavbarVariant }) {
  const [solidHeader, setSolidHeader] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (variant === 'light') {
      setSolidHeader(true);
      setShowHeader(true);
      return;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.9;
      const pastHero = currentY > heroThreshold;
      const scrollingUp = currentY < lastScrollY.current;

      setSolidHeader(pastHero);
      setShowHeader(!pastHero || scrollingUp);
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const textColor = solidHeader ? 'text-black' : 'text-white';
  const mutedText = solidHeader ? 'text-black/70' : 'text-white/80';
  const hoverText = solidHeader ? 'hover:text-black' : 'hover:text-white';
  const bgColor = solidHeader ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent';
  const translateClass = showHeader ? 'translate-y-0' : '-translate-y-full';

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-300 ${translateClass}`}>
      <div className={`${bgColor} transition-colors duration-300`}>
        <div className={`mx-auto flex max-w-[1200px] items-center justify-between px-4 py-6 ${textColor}`}>
        <a href="/" className="text-sm font-semibold uppercase tracking-[0.35em]">
          QARWAAN
        </a>
        <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.25em] md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={`${mutedText} ${hoverText}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="/enquire"
          className={`q-button ${
            variant === 'transparent'
              ? 'hover:!bg-transparent hover:!text-white hover:!border-white'
              : ''
          } ${solidHeader ? 'text-white' : 'text-white'}`}
        >
          Enquire now
        </a>
        </div>
      </div>
    </header>
  );
}
