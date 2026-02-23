import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { downloadPaymentInvoicePdf, getPaymentInvoice } from '../../lib/api';
import type { PaymentInvoiceRecord } from '../../types/admin';

export default function InvoicePage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [invoice, setInvoice] = useState<PaymentInvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!paymentId) {
        setError('Payment id is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const data = await getPaymentInvoice(paymentId);
        setInvoice(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [paymentId]);

  const handleDownload = async () => {
    if (!paymentId) return;
    setDownloading(true);
    setError('');
    try {
      await downloadPaymentInvoicePdf(paymentId);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading invoice...</div>;
  }

  if (error || !invoice) {
    return (
      <main className="p-8">
        <p className="text-rose-600">{error || 'Invoice not found'}</p>
        <Link to="/" className="mt-3 inline-block text-[#112211] hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4faf8] print:bg-white">
      <div className="print:hidden">
        <div className="relative h-24 bg-gradient-to-r from-[#112211] via-[#193125] to-[#1f3b2c]">
          <Header />
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 print:border-none print:shadow-none">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-[#112211]">Invoice</h1>
              <p className="text-sm text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
            <div className="print:hidden flex gap-2">
              <button onClick={handleDownload} disabled={downloading} className="rounded-lg border border-[#112211] px-4 py-2 text-sm font-semibold text-[#112211] disabled:opacity-60">
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <button onClick={() => window.print()} className="rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white">
                Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
            <div>
              <p><span className="font-semibold">Issued:</span> {new Date(invoice.issuedAt).toLocaleString()}</p>
              <p><span className="font-semibold">Status:</span> {invoice.status}</p>
              <p><span className="font-semibold">Currency:</span> {invoice.currency}</p>
            </div>
            <div>
              <p className="font-semibold text-[#112211]">{invoice.customer.name}</p>
              <p>{invoice.customer.email}</p>
              <p>{invoice.customer.phone}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border p-4 text-sm">
            <p className="font-semibold text-[#112211]">Trip</p>
            <p>{invoice.trip?.name || invoice.booking?.tripName || 'Travel package'}</p>
            {invoice.trip ? <p className="text-gray-600">{invoice.trip.location}</p> : null}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            {invoice.lineItems.map((line, index) => (
              <div key={`${line.label}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span>{line.label}</span>
                <span>{invoice.currency} {line.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-[#f6faf8] p-4 text-sm">
            <p>Subtotal: {invoice.currency} {invoice.totals.subtotal.toLocaleString()}</p>
            <p>Refunded: {invoice.currency} {invoice.totals.refunded.toLocaleString()}</p>
            <p className="font-bold text-[#112211]">Net Paid: {invoice.currency} {invoice.totals.netPaid.toLocaleString()}</p>
          </div>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
