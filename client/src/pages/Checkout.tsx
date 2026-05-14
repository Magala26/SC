import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

export default function Checkout() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const bookingIdsStr = searchParams.get('bookingIds');
  const bookingIds = bookingIdsStr ? bookingIdsStr.split(',').map(Number) : [];

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Fetch all services to have them available
  const { data: allServices = [] } = trpc.sneaker.services.list.useQuery();

  // Fetch all bookings
  const bookingsData = bookingIds.map((id) =>
    trpc.sneaker.bookings.getById.useQuery({ id }, { enabled: !!id })
  );

  const bookings = bookingsData.map((q) => q.data).filter(Boolean);

  // Combine bookings with their services
  const orderData = useMemo(() => {
    if (bookings.length === 0) return null;

    const bookingsWithServices = bookings.map((booking) => {
      if (!booking) return null;
      const service = allServices.find((s) => s.id === booking.serviceId);
      return { ...booking, service };
    }).filter(Boolean);

    const totalAmount = bookingsWithServices.reduce(
      (sum, booking: any) => sum + (booking?.service?.price || 0),
      0
    );

    return {
      bookings: bookingsWithServices,
      totalAmount,
    };
  }, [bookings, allServices]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus('success');
      toast.success('Payment processed successfully!');

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      setPaymentStatus('error');
      toast.error('Payment failed. Please try again.');
    }
  };

  if (!bookingIds.length || !orderData) {
    return (
      <Layout>
        <section className="bg-background py-24">
          <div className="container text-center">
            <p className="text-lg">Loading order details...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <Layout>
        <section className="bg-background py-24">
          <div className="container max-w-2xl text-center">
            <div className="border-2 border-accent p-12">
              <h1 className="text-accent mb-6">Payment Successful!</h1>
              <p className="text-lg mb-4">Thank you for your order.</p>
              <div className="space-y-2 mb-8">
                {orderData.bookings.map((booking: any, idx: number) => (
                  <div key={idx}>
                    <p>
                      <strong>Service {idx + 1}:</strong> {booking.service?.name}
                    </p>
                    <p>
                      <strong>Date:</strong> {booking.bookingDate} at {booking.bookingTime}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">Redirecting to home page...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Checkout</h1>
          <p className="text-lg">Complete your booking with secure payment.</p>
        </div>
      </section>

      {/* Red Divider */}
      <div className="red-divider" />

      {/* Checkout Content */}
      <section className="bg-background py-16 md:py-24">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="mb-8">Order Summary</h2>
            <div className="border-2 border-foreground p-8 space-y-6">
              {orderData.bookings.map((booking: any, idx: number) => (
                <div key={idx}>
                  <p className="text-sm text-muted uppercase mb-2">Service {idx + 1}</p>
                  <p className="font-bold text-lg mb-4">{booking.service?.name}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <span>Price:</span>
                    <span className="font-bold text-accent">
                      R {(booking.service?.price / 100).toFixed(2)}
                    </span>
                  </div>
                  {idx < orderData.bookings.length - 1 && <div className="border-b-2 border-muted my-4" />}
                </div>
              ))}

              <div className="border-t-2 border-muted pt-6">
                <p className="text-sm text-muted uppercase mb-2">Booking Details</p>
                <div className="space-y-2">
                  <p>
                    <strong>Date:</strong> {orderData.bookings[0]?.bookingDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {orderData.bookings[0]?.bookingTime}
                  </p>
                  <p>
                    <strong>Customer:</strong> {orderData.bookings[0]?.customerName}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-muted pt-6">
                <div className="flex justify-between items-center">
                  <p className="font-bold uppercase">Total</p>
                  <p className="text-3xl font-bold text-accent">
                    R {(orderData.totalAmount / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="mb-8">Payment Information</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block font-bold uppercase mb-3">Full Name *</label>
                <input
                  type="text"
                  value={orderData.bookings[0]?.customerName}
                  readOnly
                  className="w-full border-2 border-foreground bg-background p-3 opacity-75"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Email *</label>
                <input
                  type="email"
                  value={orderData.bookings[0]?.customerEmail}
                  readOnly
                  className="w-full border-2 border-foreground bg-background p-3 opacity-75"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Card Number *</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border-2 border-foreground bg-background p-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase mb-3 text-sm">Expiry *</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border-2 border-foreground bg-background p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-3 text-sm">CVC *</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border-2 border-foreground bg-background p-3"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentStatus === 'processing'}
                className="btn-primary w-full font-bold uppercase disabled:opacity-50"
              >
                {paymentStatus === 'processing'
                  ? 'Processing Payment...'
                  : `Pay R ${(orderData.totalAmount / 100).toFixed(2)}`}
              </button>

              {paymentStatus === 'error' && (
                <div className="border-2 border-accent p-4 text-center text-accent">
                  <p>Payment failed. Please try again.</p>
                </div>
              )}
            </form>

            <p className="text-xs text-muted mt-6 text-center">
              Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
