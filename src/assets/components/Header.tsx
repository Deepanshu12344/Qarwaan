import { Plane, Hotel } from 'lucide-react';
import { Compass, Phone } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <nav className="container mx-auto flex items-center justify-between px-5 py-6 md:px-8">
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/trips"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-white/15"
          >
            <Plane className="w-4 h-4" />
            <span className="text-sm font-medium">Packages</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-white/15"
          >
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-medium">Custom Days</span>
          </Link>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <Compass className="h-5 w-5 text-[#8DD3BB]" />
          <h1 className="text-2xl font-bold tracking-wider text-white">Qarwaan</h1>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink to="/" className="text-sm font-medium text-white/90 hover:text-white">
            Home
          </NavLink>
          <NavLink to="/trips" className="text-sm font-medium text-white/90 hover:text-white">
            Trips
          </NavLink>
          <NavLink to="/contact" className="text-sm font-medium text-white/90 hover:text-white">
            Contact
          </NavLink>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#8DD3BB] px-4 py-2 text-sm font-semibold text-[#112211] transition hover:bg-[#7ec6ac]"
          >
            <Phone className="h-4 w-4" />
            Plan My Trip
          </Link>
        </div>
      </nav>
    </header>
  );
}
