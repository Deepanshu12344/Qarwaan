import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';

const inputBase =
  'w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20';

export default function EnquirePage() {
  useSeo({
    title: 'Enquire | Qarwaan',
    description: 'Begin your luxury travel enquiry with Qarwaan.',
    path: '/enquire',
  });

  return (
    <div className="min-h-screen bg-[#f6f4f1]">
      <Navbar variant="light" />
      <div className="pt-24">
        <div className="bg-black py-2 text-center text-[0.6rem] uppercase tracking-[0.35em] text-white/80">
          We are open Monday at 9.00am
        </div>

        <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-12">
          <div className="text-center">
            <p className="q-kicker text-gray-500">QARWAAN</p>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] text-black md:text-4xl">
              We Are Open Monday At 9.00am
            </h1>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Your Trip</p>
              <div className="mt-6 grid grid-cols-1 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Where would you like to go?
                  </label>
                  <select className={`${inputBase} mt-2`}>
                    <option>Select as many options you want</option>
                    <option>Japan</option>
                    <option>Italy</option>
                    <option>Morocco</option>
                    <option>Peru</option>
                    <option>Iceland</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">
                    When would you like to go?
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <select className={inputBase}>
                      <option>Select a month</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                    </select>
                    <select className={inputBase}>
                      <option>Select a year</option>
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                    </select>
                    <input className={inputBase} placeholder="Duration of trip" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      How many people are travelling?
                    </label>
                    <select className={`${inputBase} mt-2`}>
                      <option>Select a number</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      How much would you like to spend per person?
                    </label>
                    <div className="mt-3">
                      <div className="mb-2 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-500">
                        <span>₹5,000</span>
                        <span>₹10,000</span>
                        <span>₹20,000+</span>
                      </div>
                      <input type="range" min="5000" max="20000" className="w-full accent-black" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Any other comments or requests?
                  </label>
                  <textarea className={`${inputBase} mt-2 min-h-[120px]`} placeholder="E.g. special occasion, any must-do or don'ts" />
                </div>
              </div>
            </div>

            <aside className="rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8">
              <div className="text-center">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-black/10" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Office Hours</p>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p>Monday: 9.00am - 11.00pm</p>
                  <p>Tuesday: 9.00am - 11.00pm</p>
                  <p>Wednesday: 9.00am - 11.00pm</p>
                  <p>Thursday: 9.00am - 11.00pm</p>
                  <p>Friday: 9.00am - 11.00pm</p>
                  <p>Saturday: Closed</p>
                  <p>Sunday: Closed</p>
                </div>
                <p className="mt-6 text-[0.7rem] uppercase tracking-[0.25em] text-gray-400">
                  (excluding national holidays)
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Your Details</p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Your Name*
                </label>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input className={inputBase} placeholder="First name" />
                  <input className={inputBase} placeholder="Last name" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Email Address*
                </label>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input className={inputBase} placeholder="example@email.com" />
                  <input className={inputBase} placeholder="Confirm email" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Telephone*
                </label>
                <div className="mt-2 flex gap-2">
                  <select className="rounded-lg border border-black/10 bg-white px-3 py-3 text-sm">
                    <option>+91</option>
                    <option>+44</option>
                    <option>+1</option>
                  </select>
                  <input className={inputBase} placeholder="Phone number" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  How did you hear about us?
                </label>
                <select className={`${inputBase} mt-2`}>
                  <option>Select</option>
                  <option>Recommendation</option>
                  <option>Press</option>
                  <option>Instagram</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-black" />
                Sign up to our newsletter for weekly inspiration curated by our Travel Experts
              </label>
            </div>

            <div className="mt-8">
              <button className="q-button !bg-black !text-white !border-black">Submit enquiry</button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
