import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Clock3, MapPin, Star } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {
  createPaymentOrder,
  getTripDetails,
  getTripReviews,
  saveTrip,
  submitBooking,
  submitTripReview,
  validateCoupon,
  verifyPayment,
} from '../../lib/api';
import { trackEvent } from '../../lib/analytics';
import { useSitePreferences } from '../../context/useSitePreferences';
import type { Trip } from '../../types/trip';
import type { TripReview } from '../../types/review';

type BookingState = {
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  specialRequest: string;
};

type PaymentState = {
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  amount: string;
};

const initialBooking: BookingState = {
  fullName: '',
  email: '',
  phone: '',
  travelers: 2,
  travelDate: '',
  specialRequest: '',
};

const initialPayment: PaymentState = {
  payerName: '',
  payerEmail: '',
  payerPhone: '',
  amount: '',
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function TripDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatMoney } = useSitePreferences();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(initialBooking);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [latestBookingId, setLatestBookingId] = useState('');

  const [payment, setPayment] = useState(initialPayment);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [latestPaidPaymentId, setLatestPaidPaymentId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [baseAmount, setBaseAmount] = useState(0);
  const [savedMessage, setSavedMessage] = useState('');
  const [savedError, setSavedError] = useState('');

  const [reviews, setReviews] = useState<TripReview[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!slug) return;

      setLoading(true);
      setError('');
      try {
        const data = await getTripDetails(slug);
        setTrip(data);
        void trackEvent('trip_view', {
          tripSlug: data.slug,
          tripName: data.name,
          location: data.location,
          category: data.category,
          price: data.discountedPrice || data.price,
        });
        const reviewData = await getTripReviews(slug);
        setReviews(reviewData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Could not fetch trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [slug]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const paymentId = searchParams.get('paymentId');
    const stripeSessionId = searchParams.get('session_id') || undefined;

    if (!paymentStatus || !paymentId) return;

    if (paymentStatus === 'cancelled') {
      setPaymentMessage('Payment was cancelled before completion.');
      void trackEvent('payment_failed', {
        paymentId,
        reason: 'stripe_cancelled',
      });
      setSearchParams(new URLSearchParams());
      return;
    }

    if (paymentStatus !== 'success') return;

    const reconcile = async () => {
      setProcessingPayment(true);
      setPaymentError('');
      try {
        const verify = await verifyPayment({
          paymentId,
          stripe_session_id: stripeSessionId,
        });
        setPaymentMessage(verify.message);
        setLatestPaidPaymentId(paymentId);
        void trackEvent('payment_success', {
          paymentId,
          gateway: 'stripe',
          source: 'stripe_return',
        });
      } catch (verifyError) {
        setPaymentError(verifyError instanceof Error ? verifyError.message : 'Payment verification failed');
        void trackEvent('payment_failed', {
          paymentId,
          gateway: 'stripe',
          source: 'stripe_return',
        });
      } finally {
        setProcessingPayment(false);
        setSearchParams(new URLSearchParams());
      }
    };

    void reconcile();
  }, [searchParams, setSearchParams]);

  const handleBookingSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!slug) return;

    setSubmitting(true);
    setBookingMessage('');
    setBookingError('');

    try {
      const response = await submitBooking(slug, {
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        travelers: booking.travelers,
        travelDate: booking.travelDate,
        specialRequest: booking.specialRequest,
        couponCode: couponCode.trim() || undefined,
      });

      setLatestBookingId(response.bookingId);
      setBaseAmount(response.totalAmount);
      setBookingMessage(`${response.message} Estimated total: ${formatMoney(response.totalAmount)}`);
      void trackEvent('booking_request_submitted', {
        bookingId: response.bookingId,
        tripSlug: slug,
        amount: response.totalAmount,
        travelers: booking.travelers,
      });
      setPayment((prev) => ({
        ...prev,
        payerName: booking.fullName,
        payerEmail: booking.email,
        payerPhone: booking.phone,
        amount: String(response.totalAmount),
      }));
      setBooking(initialBooking);
      setCouponCode('');
      setCouponMessage('');
      setCouponError('');
    } catch (submitError) {
      setBookingError(submitError instanceof Error ? submitError.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const amount = Number(payment.amount || baseAmount);
    if (!amount || amount <= 0) {
      setCouponError('Create a booking first to apply coupon');
      return;
    }
    setApplyingCoupon(true);
    setCouponError('');
    setCouponMessage('');
    try {
      const data = await validateCoupon(couponCode.trim().toUpperCase(), amount);
      setPayment((prev) => ({ ...prev, amount: String(Math.round(data.finalAmount)) }));
      setCouponMessage(`Coupon applied. Discount ${formatMoney(Math.round(data.discount))}`);
    } catch (couponApplyError) {
      setCouponError(couponApplyError instanceof Error ? couponApplyError.message : 'Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!trip?._id) return;
    setSavedError('');
    setSavedMessage('');
    try {
      await saveTrip(trip._id);
      setSavedMessage('Trip saved to your account');
    } catch (saveError) {
      setSavedError(saveError instanceof Error ? saveError.message : 'Login required to save trip');
    }
  };

  const handleSubmitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!slug) return;
    setReviewSubmitting(true);
    setReviewError('');
    setReviewMessage('');
    try {
      const response = await submitTripReview(slug, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewMessage(response.message);
      setReviewTitle('');
      setReviewComment('');
      const reviewData = await getTripReviews(slug);
      setReviews(reviewData);
    } catch (submitError) {
      setReviewError(submitError instanceof Error ? submitError.message : 'Review submit failed');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!slug) return;

    setProcessingPayment(true);
    setPaymentError('');
    setPaymentMessage('');
    setLatestPaidPaymentId('');

    try {
      void trackEvent('payment_initiated', {
        tripSlug: slug,
        amount: Number(payment.amount),
        bookingId: latestBookingId || undefined,
      });
      const order = await createPaymentOrder({
        bookingId: latestBookingId || undefined,
        tripSlug: slug,
        payerName: payment.payerName,
        payerEmail: payment.payerEmail,
        payerPhone: payment.payerPhone,
        amount: Number(payment.amount),
      });

      if (order.gateway === 'mock') {
        const verify = await verifyPayment({ paymentId: order.paymentId, status: 'paid' });
        setPaymentMessage(verify.message);
        setLatestPaidPaymentId(order.paymentId);
        void trackEvent('payment_success', {
          paymentId: order.paymentId,
          gateway: 'mock',
        });
      } else if (order.gateway === 'stripe') {
        if (!order.checkoutUrl) {
          throw new Error('Stripe checkout URL missing in order response');
        }
        window.location.href = order.checkoutUrl;
      } else if (window.Razorpay) {
        const rz = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'Qarwaan Travels',
          description: `${trip?.name || 'Trip'} Payment`,
          order_id: order.orderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            const verify = await verifyPayment({
              paymentId: order.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaymentMessage(verify.message);
            setLatestPaidPaymentId(order.paymentId);
            void trackEvent('payment_success', {
              paymentId: order.paymentId,
              gateway: 'razorpay',
            });
          },
        });
        rz.open();
      } else {
        setPaymentMessage('Order created. Razorpay checkout script is not available in this environment.');
      }
    } catch (payError) {
      setPaymentError(payError instanceof Error ? payError.message : 'Payment failed');
      void trackEvent('payment_failed', {
        tripSlug: slug,
        amount: Number(payment.amount),
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading trip details...</div>;
  }

  if (error || !trip) {
    return (
      <div className="p-8">
        <p className="text-rose-600">{error || 'Trip not found'}</p>
        <Link to="/trips" className="mt-3 inline-block text-[#112211] hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  const effectivePrice = trip.discountedPrice || trip.price;

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative h-[520px] overflow-hidden">
        <img src={trip.heroImage} alt={trip.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112211] via-black/40 to-black/20" />
        <Header />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-5 text-white md:px-8">
            <p className="text-sm font-medium text-[#8DD3BB]">{trip.category} Package</p>
            <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{trip.name}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#8DD3BB]" />
                {trip.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4 text-[#8DD3BB]" />
                {trip.durationDays} Days / {trip.nights} Nights
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {trip.rating} ({trip.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto grid grid-cols-1 gap-8 px-5 py-12 md:px-8 lg:grid-cols-3">
        <section className="space-y-8 lg:col-span-2">
          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-3 text-2xl font-bold text-[#112211]">Overview</h2>
            <p className="leading-7 text-gray-700">{trip.overview}</p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Highlights</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {trip.highlights.map((item) => (
                <p key={item} className="rounded-lg bg-[#f1f9f6] px-4 py-3 text-sm font-medium text-[#24443b]">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Day Wise Itinerary</h2>
            <div className="space-y-4">
              {trip.itinerary.map((item) => (
                <div key={item.day} className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#3e7d69]">Day {item.day}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#112211]">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Availability Calendar</h2>
            {trip.availability && trip.availability.length > 0 ? (
              <div className="space-y-2">
                {trip.availability.slice(0, 12).map((slot, index) => (
                  <div key={`${slot.date}-${index}`} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <span>{slot.date}</span>
                    <span>Seats left: {slot.seatsLeft}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${slot.status === 'open' ? 'bg-emerald-100 text-emerald-700' : slot.status === 'waitlist' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{slot.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No fixed departures listed. Contact us for custom dates.</p>
            )}
            {trip.blackoutDates && trip.blackoutDates.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm font-semibold text-[#112211]">Blackout Dates</p>
                <p className="text-sm text-gray-600">{trip.blackoutDates.join(', ')}</p>
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#112211]">Customer Reviews</h2>
            <div className="space-y-3">
              {reviews.length === 0 ? <p className="text-sm text-gray-600">No approved reviews yet.</p> : reviews.map((review) => (
                <div key={review._id} className="rounded-lg border p-3">
                  <p className="font-semibold text-[#112211]">{review.authorName} {review.verified ? '• verified' : ''}</p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()} | {review.rating}/5</p>
                  {review.title ? <p className="mt-1 font-medium text-[#112211]">{review.title}</p> : null}
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
            <form className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3" onSubmit={handleSubmitReview}>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="rounded-lg border px-3 py-2">
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
              <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Review title" className="rounded-lg border px-3 py-2 md:col-span-2" />
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required rows={3} placeholder="Share your experience" className="rounded-lg border px-3 py-2 md:col-span-3" />
              <button disabled={reviewSubmitting} className="rounded-lg bg-[#112211] px-4 py-2 text-sm font-semibold text-white md:col-span-3">
                {reviewSubmitting ? 'Submitting review...' : 'Submit Review'}
              </button>
            </form>
            {reviewMessage ? <p className="mt-3 text-sm text-emerald-700">{reviewMessage}</p> : null}
            {reviewError ? <p className="mt-3 text-sm text-rose-600">{reviewError}</p> : null}
          </article>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[#112211]">Inclusions</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {trip.inclusions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[#112211]">Exclusions</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {trip.exclusions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_18px_40px_rgba(17,34,17,0.08)]">
          <p className="text-sm text-gray-500">Starting from</p>
          {trip.discountedPrice ? (
            <p className="text-sm text-gray-400 line-through">{formatMoney(trip.price)}</p>
          ) : null}
          <p className="text-3xl font-extrabold text-[#112211]">{formatMoney(effectivePrice)}</p>
          <p className="mb-6 text-sm text-gray-500">per traveler</p>
          <button onClick={handleSaveTrip} className="mb-4 w-full rounded-lg border border-[#112211] px-4 py-2 text-sm font-semibold text-[#112211]">
            Save Trip
          </button>
          {savedMessage ? <p className="mb-2 text-sm text-emerald-700">{savedMessage}</p> : null}
          {savedError ? <p className="mb-2 text-sm text-rose-600">{savedError}</p> : null}

          <h3 className="mb-3 text-lg font-bold text-[#112211]">Book This Package</h3>
          <form onSubmit={handleBookingSubmit} className="space-y-3">
            <input
              type="text"
              value={booking.fullName}
              onChange={(event) => setBooking((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Full name"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="email"
              value={booking.email}
              onChange={(event) => setBooking((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="text"
              value={booking.phone}
              onChange={(event) => setBooking((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="date"
              value={booking.travelDate}
              onChange={(event) => setBooking((prev) => ({ ...prev, travelDate: event.target.value }))}
              placeholder="Travel date"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={booking.travelers}
              onChange={(event) => setBooking((prev) => ({ ...prev, travelers: Number(event.target.value) }))}
              placeholder="Number of travelers"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <textarea
              value={booking.specialRequest}
              onChange={(event) => setBooking((prev) => ({ ...prev, specialRequest: event.target.value }))}
              placeholder="Special request"
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#112211] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#081208] disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Request Booking'}
            </button>
          </form>

          {bookingMessage ? <p className="mt-3 text-sm text-emerald-700">{bookingMessage}</p> : null}
          {bookingError ? <p className="mt-3 text-sm text-rose-600">{bookingError}</p> : null}

          <hr className="my-6 border-gray-200" />
          <h3 className="mb-3 text-lg font-bold text-[#112211]">Pay Now</h3>
          <form onSubmit={handlePaymentSubmit} className="space-y-3">
            <input
              type="text"
              value={payment.payerName}
              onChange={(event) => setPayment((prev) => ({ ...prev, payerName: event.target.value }))}
              placeholder="Payer name"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="email"
              value={payment.payerEmail}
              onChange={(event) => setPayment((prev) => ({ ...prev, payerEmail: event.target.value }))}
              placeholder="Payer email"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="text"
              value={payment.payerPhone}
              onChange={(event) => setPayment((prev) => ({ ...prev, payerPhone: event.target.value }))}
              placeholder="Payer phone"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={payment.amount}
              onChange={(event) => setPayment((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Amount (INR)"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Coupon code"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#8DD3BB] focus:outline-none"
              />
              <button type="button" onClick={applyCoupon} disabled={applyingCoupon} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211] disabled:opacity-60">
                {applyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponMessage ? <p className="text-xs text-emerald-700">{couponMessage}</p> : null}
            {couponError ? <p className="text-xs text-rose-600">{couponError}</p> : null}
            <button
              type="submit"
              disabled={processingPayment}
              className="w-full rounded-lg bg-[#8DD3BB] px-4 py-3 text-sm font-semibold text-[#112211] transition hover:bg-[#78c9af] disabled:opacity-60"
            >
              {processingPayment ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>

          {paymentMessage ? <p className="mt-3 text-sm text-emerald-700">{paymentMessage}</p> : null}
          {latestPaidPaymentId ? (
            <Link to={`/invoice/${latestPaidPaymentId}`} className="mt-2 inline-block text-sm font-semibold text-[#112211] underline">
              Open printable invoice
            </Link>
          ) : null}
          {paymentError ? <p className="mt-3 text-sm text-rose-600">{paymentError}</p> : null}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
