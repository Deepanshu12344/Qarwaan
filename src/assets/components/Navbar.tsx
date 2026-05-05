import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

const navItems = [
  { label: 'Explore Trips', href: '#journey' },
  { label: 'About', href: '#what-we-do' },
  { label: 'Contact Us', href: '#trips' }
];

type NavbarVariant = 'light' | 'transparent';

export default function Navbar({
  variant = 'transparent',
  heroOffset,
}: {
  variant?: NavbarVariant;
  heroOffset?: number;
}) {
  const [solidHeader, setSolidHeader] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (variant === 'light') {
      setSolidHeader(true);
      setShowHeader(true);
      return;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      const pastHero =
        heroOffset && heroOffset > 0 ? currentY >= heroOffset : currentY > window.innerHeight * 0.9;
      const scrollingUp = currentY < lastScrollY.current;

      setSolidHeader(pastHero);
      setShowHeader(!pastHero || scrollingUp);
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, heroOffset]);

  const textColor = solidHeader ? 'text-black' : 'text-white';
  const mutedText = solidHeader ? 'text-black/70' : 'text-white/80';
  const hoverText = solidHeader ? 'hover:text-black' : 'hover:text-white';
  const bgColor = solidHeader ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent';
  const translateClass = showHeader ? 'translate-y-0' : '-translate-y-full';
  const logoTone = solidHeader ? 'teal' : 'light';
  const searchText = solidHeader ? 'text-black' : 'text-white';
  const searchBorder = solidHeader ? 'border-black/40' : 'border-white/60';
  const searchPlaceholder = solidHeader ? 'placeholder:text-black/50' : 'placeholder:text-white/80';
  const searchButtonBg = solidHeader ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20';
  const searchButtonBorder = solidHeader ? 'border-black/50' : 'border-white/70';
  const navLinkClass = solidHeader ? `${mutedText} ${hoverText}` : 'text-white hover:text-white';

  return (
    <header
      id="main-header"
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-300 ${translateClass}`}
    >
      <div className={`${bgColor} transition-colors duration-300`}>
        <div className={`mx-auto flex max-w-[1200px] items-center justify-between px-4 py-6 ${textColor}`}>
        <a href="/" aria-label="Qarwaan home" className="inline-flex items-center">
          <Logo tone={logoTone} size={solidHeader ? 'fixed' : 'natural'} />
        </a>
        <nav className="hidden items-center gap-6 text-[0.85rem] font-semibold uppercase tracking-[0.12em] md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={`nav-link ${navLinkClass}`}>
              {item.label}
            </a>
          ))}
          <div className="group flex items-center">
            <input
              type="text"
              placeholder="Destinations"
              ref={searchInputRef}
              className={`h-9 w-0 rounded-full border bg-transparent px-0 text-[0.85rem] uppercase tracking-[0.12em] opacity-0 outline-none transition-all duration-300 ease-out ${searchText} ${searchBorder} ${searchPlaceholder} pointer-events-none group-hover:w-44 group-hover:px-3 group-hover:opacity-100 group-hover:pointer-events-auto focus:w-44 focus:px-3 focus:opacity-100 focus:pointer-events-auto focus:ring-2 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/40`}
            />
            <button
              type="button"
              aria-label="Search destinations"
              onClick={() => searchInputRef.current?.focus()}
              className={`ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${searchText} ${searchButtonBorder} ${searchButtonBg}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </nav>
        <a
          href="/enquire"
          className={`q-button !bg-[#004643] !text-white !border-[#004643] ${
            variant === 'transparent' && !solidHeader
              ? 'hover:!bg-transparent hover:!text-white hover:!border-white'
              : ''
          } ${solidHeader ? 'text-white' : 'text-white'}`}
        >
          Plan Your Trip
        </a>
        </div>
      </div>
    </header>
  );
}
