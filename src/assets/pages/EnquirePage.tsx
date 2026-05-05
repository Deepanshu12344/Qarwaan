import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSeo } from '../../lib/seo';
import { useTrips } from '../data/useTrips';

const inputBase =
  'w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20';

const calendarWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date; inCurrentMonth: boolean }> = [];

  for (let index = startOffset - 1; index >= 0; index -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - index),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (cells.length < 42) {
    const day = cells.length - (startOffset + daysInMonth) + 1;
    cells.push({
      date: new Date(year, month + 1, day),
      inCurrentMonth: false,
    });
  }

  return cells;
}

export default function EnquirePage() {
  const location = useLocation();
  const [budgetAmount, setBudgetAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const countryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('country')?.trim().toLowerCase() ?? '';
  }, [location.search]);
  const { trips } = useTrips();
  const posterTrip = useMemo(() => {
    if (!countryParam) {
      return null;
    }
    return (
      trips.find(
        (trip) =>
          trip.title.toLowerCase() === countryParam ||
          (trip.location ?? '').toLowerCase() === countryParam,
      ) ?? null
    );
  }, [countryParam, trips]);
  const destinationOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: string[] = [];

    trips.forEach((trip) => {
      const name = (trip.location ?? trip.title ?? '').trim();
      if (!name) {
        return;
      }

      const normalizedName = name.toLowerCase();
      if (seen.has(normalizedName)) {
        return;
      }

      seen.add(normalizedName);
      options.push(name);
    });

    if (countryParam && !seen.has(countryParam)) {
      options.unshift(posterTrip?.location ?? posterTrip?.title ?? countryParam);
    }

    return options.sort((a, b) => a.localeCompare(b));
  }, [countryParam, posterTrip, trips]);
  const selectedDestination = useMemo(() => {
    if (!countryParam) {
      return '';
    }

    return posterTrip?.location ?? posterTrip?.title ?? countryParam;
  }, [countryParam, posterTrip]);

  useEffect(() => {
    setDestination(selectedDestination);
  }, [selectedDestination]);

  useEffect(() => {
    if (!isCalendarOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isCalendarOpen]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const displayDateLabel = travelDate ? formatDateLabel(travelDate) : '';

  const handleBudgetChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) {
      setBudgetAmount('');
      return;
    }
    const formatted = new Intl.NumberFormat('en-US').format(Number(digitsOnly));
    setBudgetAmount(formatted);
  };

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
          Starting from x rupees  
        </div>

        <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-12">
          <div className="text-center">
            {/* <p className="q-kicker text-gray-500">QARWAAN</p> */}
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] text-black md:text-4xl">
              You pack. We handle the rest.
            </h1>
          </div>

          <form
            className="mt-10 md:flex md:items-stretch md:gap-8"
            action="https://formspree.io/f/mkopnqaw"
            method="POST"
          >
            <input type="hidden" name="_subject" value="New Qarwaan Enquiry" />
            <div className="flex-1 space-y-8">
              <div className="bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Answer these few quick questions and we’ll design a trip that fits you</p>

                <div className="mt-6 grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Where would you like to go?
                    </label>
                    <select
                      name="destination"
                      className={`${inputBase} mt-2`}
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                    >
                      <option value="">Select destination</option>
                      {destinationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">
                      When would you like to go?
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative" ref={calendarRef}>
                        <input type="hidden" name="travel_date" value={travelDate} />
                        <button
                          type="button"
                          className={`${inputBase} text-left ${travelDate ? 'text-black' : 'text-black/40'}`}
                          onClick={() => setIsCalendarOpen((value) => !value)}
                        >
                          {displayDateLabel || 'Select travel date'}
                        </button>
                        {isCalendarOpen ? (
                          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-[290px] rounded-2xl border border-[#004643]/15 bg-[#f0ede5] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#004643]/15 text-black transition hover:bg-[#004643] hover:text-white"
                                onClick={() =>
                                  setCalendarMonth(
                                    (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                                  )
                                }
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black">
                                {calendarMonth.toLocaleString('en-US', {
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#004643]/15 text-black transition hover:bg-[#004643] hover:text-white"
                                onClick={() =>
                                  setCalendarMonth(
                                    (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                                  )
                                }
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-black/55">
                              {calendarWeekdays.map((day) => (
                                <span key={day}>{day}</span>
                              ))}
                            </div>
                            <div className="mt-3 grid grid-cols-7 gap-2">
                              {calendarDays.map(({ date, inCurrentMonth }) => {
                                const value = formatDateValue(date);
                                const isSelected = value === travelDate;
                                const isToday = value === formatDateValue(new Date());

                                return (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`flex h-10 items-center justify-center rounded-full text-sm transition ${
                                      isSelected
                                        ? 'bg-[#004643] text-white'
                                        : inCurrentMonth
                                          ? 'text-black hover:bg-[#004643]/10'
                                          : 'text-black/30 hover:bg-[#004643]/8'
                                    } ${isToday && !isSelected ? 'border border-[#004643]/35' : ''}`}
                                    onClick={() => {
                                      setTravelDate(value);
                                      setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                                      setIsCalendarOpen(false);
                                    }}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <input name="trip_duration" className={inputBase} placeholder="Duration of trip" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Budget
                      </label>
                      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <select name="budget_currency" className={inputBase}>
                          <option>Select currency</option>
                          <option>USD</option>
                          <option>INR</option>
                        </select>
                        <input
                          name="budget_amount"
                          className={inputBase}
                          placeholder="Budget amount"
                          inputMode="numeric"
                          value={budgetAmount}
                          onChange={(event) => handleBudgetChange(event.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        How many people are travelling?
                      </label>
                      <select name="traveler_count" className={`${inputBase} mt-2`}>
                        <option>Select a number</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Tell us anything specific you want for your trip
                    </label>
                    <textarea
                      name="notes"
                      className={`${inputBase} mt-2 min-h-[120px]`}
                      placeholder="E.g. special occasion, any must-do or don'ts"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Details</p>
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Your Name*
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input name="first_name" className={inputBase} placeholder="First name" required />
                      <input name="last_name" className={inputBase} placeholder="Last name" required />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Email Address*
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        name="email"
                        type="email"
                        className={inputBase}
                        placeholder="example@email.com"
                        required
                      />
                      <input
                        name="confirm_email"
                        type="email"
                        className={inputBase}
                        placeholder="Confirm email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Contact*
                    </label>
                    <div className="mt-2 flex gap-2">
                      <select name="country_code" className="rounded-lg border border-black/10 bg-white px-3 py-3 text-sm">
                        <option>+91</option>
                        <option>+44</option>
                        <option>+1</option>
                      </select>
                      <input name="phone" className={inputBase} placeholder="Phone number" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      How did you hear about us?
                    </label>
                    <select name="referral_source" className={`${inputBase} mt-2`}>
                      <option>Select</option>
                      <option>Recommendation</option>
                      <option>Press</option>
                      <option>Instagram</option>
                    </select>
                  </div>
                </div>

                {/* <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-black" />
                    Sign up to our newsletter for weekly inspiration curated by our Travel Experts
                  </label>
                </div> */}

                <div className="mt-8">
                    <button type="submit" className="q-button !bg-[#004643] !text-white !border-[#004643] cursor-pointer">
                    Let's Go
                  </button>
                </div>
              </div>
            </div>

            {posterTrip ? (
              <aside className="mt-8 w-full shrink-0 md:mt-0 md:w-[360px]">
                <div className="flex h-full flex-col overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                  <div
                    className="min-h-[320px] w-full flex-1 bg-cover bg-center"
                    style={{ backgroundImage: `url(${posterTrip.hero?.image ?? posterTrip.image})` }}
                  />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      {posterTrip.location ?? posterTrip.title}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold uppercase tracking-[0.18em] text-black">
                      {posterTrip.hero?.subtitle ?? posterTrip.description}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600">
                      {posterTrip.nights ?? posterTrip.stats?.duration ?? 'Curated journey'}
                    </p>
                  </div>
                </div>
              </aside>
            ) : null}
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}
