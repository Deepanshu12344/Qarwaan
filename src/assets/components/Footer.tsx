import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const columns = [
  {
    title: 'Destinations',
    items: ['Japan', 'Italy', 'Morocco', 'Peru', 'Iceland'],
  },
  {
    title: 'Experiences',
    items: ['Adventure', 'Culture', 'Food & Wine', 'Wildlife', 'Wellness'],
  },
  {
    title: 'Company',
    items: ['About QARWAAN', 'Our Story', 'Press', 'Careers'],
  },
  {
    title: 'Support',
    items: ['Contact', 'FAQ', 'Terms', 'Privacy'],
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-black py-16 text-white">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <img
              src="/qarwaan-logo-light.png"
              alt="Qarwaan"
              className="h-8 w-[96px] md:h-10 md:w-[120px]"
              loading="eager"
            />
            <p className="mt-3 text-sm text-white/70">Luxury journeys designed with editorial clarity.</p>
          </div>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-sm border border-white/30 bg-transparent px-4 py-3 text-sm text-white outline-none"
            />
            <button type="submit" className="q-button q-button-outline text-white">
              Sign Up
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/60">{column.title}</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs uppercase tracking-[0.2em] text-white/60 md:flex-row">
          <span>Qarwaan Travel</span>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="text-white/70 hover:text-white">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="text-white/70 hover:text-white">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
