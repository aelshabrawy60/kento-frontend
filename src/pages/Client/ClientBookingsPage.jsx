import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Calendar, Package, CreditCard, Clock, CheckCircle2, XCircle,
  Loader2, AlertCircle, Camera, FlaskConical, Sparkles, PlayCircle,
  CheckCheck, Bell
} from 'lucide-react';
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
    label: 'Accepted — Pay Deposit to Confirm',
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
    label: 'Deposit Paid',
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
    icon: <PlayCircle size={14} />,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: <CheckCheck size={14} />,
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
function BookingCard({ booking, onPayNow, onComplete, paying, completing }) {
  const vendor = booking.vendor;
  const vendorName = vendor?.user?.name || 'Unknown Photographer';
  const vendorPhoto = vendor?.user?.profilePicture;
  const pkg = booking.package;

  const isAccepted   = booking.status === 'ACCEPTED';
  const isInProgress = booking.status === 'IN_PROGRESS';
  const isPaid       = booking.status === 'PAID';

  // 10% deposit
  const depositAmount = pkg ? Math.ceil(pkg.price * 0.10) : 0;

  // Vendor requested completion?
  const completionRequested = booking.completionRequestedByVendor;

  const accentColor =
    booking.status === 'ACCEPTED'    ? 'bg-emerald-400' :
    booking.status === 'IN_PROGRESS' ? 'bg-purple-400' :
    booking.status === 'COMPLETED'   ? 'bg-teal-400' :
    booking.status === 'PAID'        ? 'bg-blue-400' :
    booking.status === 'REJECTED'    ? 'bg-red-400' :
    booking.status === 'PENDING'     ? 'bg-amber-400' :
    'bg-gray-300';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${accentColor}`} />

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

        {/* Date + Full Price */}
        <div className="flex items-center justify-between text-sm mb-1">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={14} />
            <span>{formatDate(booking.serviceDate)}</span>
          </div>
          <div className="font-bold text-gray-700 text-base">
            {pkg ? formatePrice(pkg.price, 'EGP') : '—'}
          </div>
        </div>

        {/* ── ACCEPTED: Pay Deposit CTA ── */}
        {isAccepted && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Deposit breakdown */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Full package price</span>
                <span className="font-semibold text-gray-800">{pkg ? formatePrice(pkg.price, 'EGP') : '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1.5">
                <span className="text-emerald-700 font-semibold">Deposit due now (10%)</span>
                <span className="font-bold text-emerald-700 text-base">{formatePrice(depositAmount, 'EGP')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">The remaining balance is paid after the session.</p>
            </div>

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
                  Pay {formatePrice(depositAmount, 'EGP')} Deposit
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              🔒 Secure payment powered by Kashier
            </p>
          </div>
        )}

        {/* ── IN_PROGRESS: Vendor completion request banner + Complete button ── */}
        {isInProgress && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {completionRequested && (
              <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-3">
                <Bell size={16} className="text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-violet-800">Your photographer says work is done!</p>
                  <p className="text-xs text-violet-600 mt-0.5">Please confirm that you've received the deliverables to complete the booking.</p>
                </div>
              </div>
            )}
            <button
              id={`complete-btn-${booking.id}`}
              onClick={() => onComplete(booking.id)}
              disabled={completing === booking.id}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white rounded-xl py-3 px-4 font-semibold text-sm hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {completing === booking.id ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCheck size={16} />
                  Mark as Complete
                </>
              )}
            </button>
          </div>
        )}

        {/* ── PAID: Transient state notice ── */}
        {isPaid && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl p-3">
              <Loader2 size={14} className="animate-spin" />
              <span>Payment confirmed — session starting soon.</span>
            </div>
          </div>
        )}

        {/* ── COMPLETED: Celebration ── */}
        {booking.status === 'COMPLETED' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 rounded-xl p-3">
              <Sparkles size={14} />
              <span className="font-medium">Session completed! Thank you for booking.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ClientBookingsPage() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [paying, setPaying]         = useState(null);
  const [completing, setCompleting] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);

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

  const handleComplete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to mark this booking as complete? This confirms you have received all deliverables.')) return;
    setCompleting(bookingId);
    try {
      await api.patch(`/clients/bookings/${bookingId}/complete`);
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setCompleting(null);
    }
  };

  const pendingBookings    = bookings.filter(b => b.status === 'PENDING');
  const acceptedBookings   = bookings.filter(b => b.status === 'ACCEPTED');
  const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'PAID');
  const otherBookings      = bookings.filter(b => !['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'PAID'].includes(b.status));

  // Count bookings needing action
  const completionRequestedCount = inProgressBookings.filter(b => b.completionRequestedByVendor).length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">Track your photography session requests</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Completion requests badge */}
            {completionRequestedCount > 0 && (
              <div className="flex items-center gap-2 bg-violet-50 border border-violet-300 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm animate-pulse">
                <Bell size={15} />
                {completionRequestedCount} awaiting your confirmation
              </div>
            )}

            {/* Test mode badge */}
            {isTestMode && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <FlaskConical size={15} />
                Test Mode — no real charges
              </div>
            )}
          </div>
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

            {/* Action Required — Pay deposit */}
            {acceptedBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Action Required — Pay Deposit</h2>
                </div>
                <div className="grid gap-4">
                  {acceptedBookings.map(b => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onPayNow={handlePayNow}
                      onComplete={handleComplete}
                      paying={paying}
                      completing={completing}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* In Progress */}
            {inProgressBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">In Progress</h2>
                </div>
                <div className="grid gap-4">
                  {inProgressBookings.map(b => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onPayNow={handlePayNow}
                      onComplete={handleComplete}
                      paying={paying}
                      completing={completing}
                    />
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
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onPayNow={handlePayNow}
                      onComplete={handleComplete}
                      paying={paying}
                      completing={completing}
                    />
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
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onPayNow={handlePayNow}
                      onComplete={handleComplete}
                      paying={paying}
                      completing={completing}
                    />
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
