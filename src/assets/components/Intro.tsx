export default function Intro() {
  return (
    <section id="intro" className="bg-white py-20 md:py-[100px]">
      <div className="mx-auto max-w-[1200px] px-4 text-center">
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          You travel. We plan everything.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base text-gray-600">
          Travel shouldn’t feel like bookings, checklists, and endless planning.
It should feel like a story, one that unfolds beautifully, one moment at a time.
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-base text-gray-600">
At Qarwaan, we take care of everything behind the scenes, so you can simply experience the journey.
        </p>
        <div className="mt-8">
          <a href="/enquire" className="q-button">
            Let Us Plan Your Journey
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            {
              label: 'Seamless end-to-end planning',
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M8 3v4M16 3v4M7.5 11h3.5M7.5 15h6" />
                  <path d="m16.5 14 1.5 1.5 3-3" />
                </svg>
              ),
            },
            {
              label: 'Handpicked stays & experiences',
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 14.7 8l5.5.8-4 3.9.9 5.5L12 16l-5.1 2.7.9-5.5-4-3.9L9.3 8z" />
                  <path d="M7 21h10" />
                </svg>
              ),
            },
            {
              label: '24/7 on-trip support',
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 12a8 8 0 0 1 16 0" />
                  <rect x="3" y="12" width="4" height="7" rx="2" />
                  <rect x="17" y="12" width="4" height="7" rx="2" />
                  <path d="M12 19v2" />
                </svg>
              ),
            },
            {
              label: 'Personalized itineraries',
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h10l6 6-6 6H4z" />
                  <path d="M8 9h4M8 12h6M8 15h3" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 text-sm text-gray-700">
              <span className="flex h-12 w-12 items-center justify-center">
                {item.icon}
              </span>
              <p className="max-w-[200px] text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
