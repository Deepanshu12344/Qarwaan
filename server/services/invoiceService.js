function buildInvoiceNumber(payment) {
  const id = String(payment._id || '');
  const suffix = id.slice(-6).toUpperCase();
  const year = new Date().getFullYear();
  return `QAR-${year}-${suffix}`;
}

export function ensureInvoiceNumber(payment) {
  if (payment.invoiceNumber) return payment.invoiceNumber;
  return buildInvoiceNumber(payment);
}

export function buildInvoiceDocument({ payment, booking, trip, refunds = [] }) {
  const paidAt = payment.paidAt || payment.updatedAt || payment.createdAt;
  const subtotal = Number(payment.amount || 0);
  const refunded = Number(payment.refundedAmount || 0);
  const netPaid = Math.max(0, subtotal - refunded);

  return {
    invoiceNumber: ensureInvoiceNumber(payment),
    issuedAt: paidAt,
    status: payment.status,
    currency: payment.currency,
    customer: {
      name: payment.payerName,
      email: payment.payerEmail,
      phone: payment.payerPhone,
    },
    trip: trip
      ? {
          id: trip._id,
          name: trip.name,
          slug: trip.slug,
          location: trip.location,
        }
      : null,
    booking: booking
      ? {
          id: booking._id,
          tripName: booking.tripName,
          travelers: booking.travelers,
          travelDate: booking.travelDate,
          bookingStatus: booking.bookingStatus,
        }
      : null,
    lineItems: [
      {
        label: trip?.name || booking?.tripName || 'Travel package',
        amount: subtotal,
      },
    ],
    totals: {
      subtotal,
      refunded,
      netPaid,
    },
    refunds: refunds.map((refund) => ({
      id: refund._id,
      amount: refund.amount,
      reason: refund.reason || '',
      status: refund.status,
      createdAt: refund.createdAt,
    })),
  };
}
