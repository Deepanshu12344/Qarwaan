import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const content: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: 'Terms and Conditions',
    body: [
      'Bookings are confirmed after payment verification and document compliance.',
      'Itinerary timing can vary due to weather, government advisories, or vendor operations.',
      'Travelers must carry valid IDs, permits, and health documentation where applicable.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only required details for planning, ticketing, and support operations.',
      'Customer data is used for service delivery, reminders, and transactional communication.',
      'Sensitive data is stored securely and never sold to third parties.',
    ],
  },
  cancellation: {
    title: 'Cancellation and Refund Policy',
    body: [
      'Cancellation charges depend on vendor rules and timeline before departure.',
      'Refunds are initiated to original payment mode after reconciliation.',
      'Partial refunds can apply when only selected components are canceled.',
    ],
  },
  visa: {
    title: 'Visa and Documentation Disclaimer',
    body: [
      'Visa approval is solely at embassy or immigration authority discretion.',
      'Travelers are responsible for accurate documentation and deadlines.',
      'Qarwaan provides guidance but is not liable for third-party visa decisions.',
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = content[slug || ''];

  if (!doc) {
    return (
      <main className="p-8">
        <p className="text-rose-600">Legal page not found.</p>
        <Link to="/" className="mt-3 inline-block text-[#112211] underline">Back home</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative overflow-hidden bg-[#112211] pb-16">
        <Header />
        <div className="container mx-auto px-5 pt-36 text-white md:px-8">
          <h1 className="text-4xl font-extrabold">{doc.title}</h1>
        </div>
      </div>
      <main className="container mx-auto px-5 py-10 md:px-8">
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <ul className="space-y-3 text-gray-700">
            {doc.body.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
