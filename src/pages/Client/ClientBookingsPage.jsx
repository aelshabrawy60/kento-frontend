import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Package, CreditCard, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, Camera, FlaskConical } from 'lucide-react';
import formatePrice from '../../utils/formatePrice';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Awaiting Photographer',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <Clock size={14} />,
  },
  ACCEPTED: {
    label: 'Accepted — Pay to Confirm',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle2 size={14} />,
  },
  REJECTED: {
    label: 'Declined',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <XCircle size={14} />,
  },
  PAID: {
    label: 'Paid & Confirmed',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <CheckCircle2 size={14} />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: <Loader2 size={14} className="animate-spin" />,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: <CheckCircle2 size={14} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: <XCircle size={14} />,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onPayNow, paying }) {
  const vendor = booking.vendor;
  const vendorName = vendor?.user?.name || 'Unknown Photographer';
  const vendorPhoto = vendor?.user?.profilePicture;
  const pkg = booking.package;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${
        booking.status === 'ACCEPTED' ? 'bg-emerald-400' :
        booking.status === 'PAID'     ? 'bg-blue-400' :
        booking.status === 'REJECTED' ? 'bg-red-400' :
        booking.status === 'PENDING'  ? 'bg-amber-400' :
        'bg-gray-300'
      }`} />

      <div className="p-5">
        {/* Header: Vendor info + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {vendorPhoto ? (
                <img
                  src={vendorPhoto}
                  alt={vendorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera size={20} className="text-primary" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{vendorName}</p>
              {vendor?.user?.region && (
                <p className="text-xs text-gray-400">{vendor.user.region}</p>
              )}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Package Info */}
        {pkg && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Package size={14} className="text-primary" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Package</span>
            </div>
            <p className="font-semibold text-gray-800">{pkg.name}</p>
            {pkg.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pkg.description}</p>
            )}
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              {pkg.numPhotos   > 0 && <span>📷 {pkg.numPhotos} photos</span>}
              {pkg.numVideos   > 0 && <span>🎬 {pkg.numVideos} videos</span>}
              {pkg.deliveryTime > 0 && <span>🕐 {pkg.deliveryTime} days delivery</span>}
            </div>
          </div>
        )}

        {/* Date + Price */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={14} />
            <span>{formatDate(booking.serviceDate)}</span>
          </div>
          <div className="font-bold text-primary text-base">
            {pkg ? formatePrice(pkg.price, 'EGP') : '—'}
          </div>
        </div>

        {/* Pay Now CTA — only for ACCEPTED bookings */}
        {booking.status === 'ACCEPTED' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              id={`pay-btn-${booking.id}`}
              onClick={() => onPayNow(booking.id)}
              disabled={paying === booking.id}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 px-4 font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {paying === booking.id ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay Now with Kashier
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              🔒 Secure payment powered by Kashier
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ClientBookingsPage() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [paying, setPaying]       = useState(null);   // bookingId being processed
  const [isTestMode, setIsTestMode] = useState(false); // set from API response

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/clients/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePayNow = async (bookingId) => {
    setPaying(bookingId);
    try {
      const res = await api.post(`/clients/bookings/${bookingId}/pay`);
      const { paymentUrl, isTestMode: testMode } = res.data;

      // Capture the test mode flag from the backend response
      if (testMode !== undefined) setIsTestMode(testMode);

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to initiate payment. Please try again.';
      alert(message);
      setPaying(null);
    }
  };

  const pendingBookings  = bookings.filter(b => b.status === 'PENDING');
  const acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED');
  const otherBookings    = bookings.filter(b => !['PENDING', 'ACCEPTED'].includes(b.status));

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">Track your photography session requests</p>
          </div>

          {/* Test mode badge — shown when backend is in test mode */}
          {isTestMode && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm animate-pulse">
              <FlaskConical size={15} />
              Test Mode — no real charges
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm">Browse photographers and book a package to get started.</p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-8">

            {/* Action Required */}
            {acceptedBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Action Required — Pay to Confirm</h2>
                </div>
                <div className="grid gap-4">
                  {acceptedBookings.map(b => (
                    <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} paying={paying} />
                  ))}
                </div>
              </section>
            )}

            {/* Pending */}
            {pendingBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Awaiting Response</h2>
                </div>
                <div className="grid gap-4">
                  {pendingBookings.map(b => (
                    <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} paying={paying} />
                  ))}
                </div>
              </section>
            )}

            {/* Past / Other */}
            {otherBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Past Bookings</h2>
                </div>
                <div className="grid gap-4">
                  {otherBookings.map(b => (
                    <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} paying={paying} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientBookingsPage;
