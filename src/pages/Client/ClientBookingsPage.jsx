import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Calendar, Package, CreditCard, Clock, CheckCircle2, XCircle,
  Loader2, AlertCircle, Camera, Sparkles, PlayCircle, CheckCheck, Bell, FlaskConical,
} from 'lucide-react';
import formatePrice from '../../utils/formatePrice';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:     { label: 'Awaiting Photographer', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <Clock size={12} />,        strip: '#F59E0B' },
  ACCEPTED:    { label: 'Accepted — Pay Deposit', color: '#059669', bg: '#ECFDF5', border: '#6EE7B7', icon: <CheckCircle2 size={12} />, strip: '#10B981' },
  REJECTED:    { label: 'Declined',              color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <XCircle size={12} />,      strip: '#EF4444' },
  PAID:        { label: 'Deposit Paid',           color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: <CheckCircle2 size={12} />, strip: '#3B82F6' },
  IN_PROGRESS: { label: 'In Progress',            color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: <PlayCircle size={12} />,  strip: '#8B5CF6' },
  COMPLETED:   { label: 'Completed',              color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', icon: <CheckCheck size={12} />,  strip: '#14B8A6' },
  CANCELLED:   { label: 'Cancelled',              color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: <XCircle size={12} />,     strip: '#9CA3AF' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0">
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onPayNow, onComplete, paying, completing }) {
  const vendor      = booking.vendor;
  const vendorName  = vendor?.user?.name || 'Unknown Photographer';
  const vendorPhoto = vendor?.user?.profilePicture;
  const pkg         = booking.package;
  const depositAmount = pkg ? Math.ceil(pkg.price * 0.10) : 0;
  const strip = (STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING).strip;

  const isAccepted   = booking.status === 'ACCEPTED';
  const isInProgress = booking.status === 'IN_PROGRESS';
  const isPaid       = booking.status === 'PAID';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Status strip */}
      <div className="h-1 w-full" style={{ background: strip }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Vendor row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {vendorPhoto
              ? <img src={vendorPhoto} alt={vendorName} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
              : <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#008D87,#005f5b)' }}>
                  <Camera size={16} className="text-white" />
                </div>
            }
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{vendorName}</p>
              {vendor?.user?.region && <p className="text-[11px] text-gray-400 mt-0.5">{vendor.user.region}</p>}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Package info */}
        {pkg && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Package size={12} className="text-primary" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Package</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{pkg.name}</p>
            {pkg.description && <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{pkg.description}</p>}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
              {pkg.numPhotos   > 0 && <span>📷 {pkg.numPhotos} photos</span>}
              {pkg.numVideos   > 0 && <span>🎬 {pkg.numVideos} videos</span>}
              {pkg.deliveryTime > 0 && <span>🕐 {pkg.deliveryTime}d delivery</span>}
            </div>
          </div>
        )}

        {/* Date + Price row */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={13} className="text-gray-400" /> {formatDate(booking.serviceDate)}
          </span>
          {pkg && <span className="font-black text-gray-700 text-sm">{formatePrice(pkg.price, 'EGP')}</span>}
        </div>

        {/* CTAs */}
        <div className="mt-auto space-y-3">
          {/* ACCEPTED — pay deposit */}
          {isAccepted && (
            <>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Full price</span>
                  <span className="font-semibold text-gray-800">{pkg ? formatePrice(pkg.price, 'EGP') : '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">Deposit due (10%)</span>
                  <span className="font-black text-emerald-700">{formatePrice(depositAmount, 'EGP')}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Remaining balance is paid after the session.</p>
              </div>
              <button id={`pay-btn-${booking.id}`} onClick={() => onPayNow(booking.id)} disabled={paying === booking.id}
                className="w-full flex items-center justify-center gap-2 text-white rounded-xl py-3 px-4 font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 shadow-md"
                style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}>
                {paying === booking.id
                  ? <><Loader2 size={15} className="animate-spin" /> Redirecting…</>
                  : <><CreditCard size={15} /> Pay {formatePrice(depositAmount, 'EGP')} Deposit</>}
              </button>
              <p className="text-[10px] text-gray-400 text-center">🔒 Secure payment via Kashier</p>
            </>
          )}

          {/* IN_PROGRESS */}
          {isInProgress && (
            <>
              {booking.completionRequestedByVendor && (
                <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl p-3">
                  <Bell size={14} className="text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-violet-800">Your photographer says work is done!</p>
                    <p className="text-[11px] text-violet-600 mt-0.5">Confirm receipt to complete the booking.</p>
                  </div>
                </div>
              )}
              <button id={`complete-btn-${booking.id}`} onClick={() => onComplete(booking.id)} disabled={completing === booking.id}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white rounded-xl py-3 px-4 font-bold text-sm hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm">
                {completing === booking.id
                  ? <><Loader2 size={15} className="animate-spin" /> Completing…</>
                  : <><CheckCheck size={15} /> Mark as Complete</>}
              </button>
            </>
          )}

          {/* PAID transient */}
          {isPaid && (
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <Loader2 size={13} className="animate-spin" />
              Payment confirmed — session starting soon.
            </div>
          )}

          {/* COMPLETED */}
          {booking.status === 'COMPLETED' && (
            <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
              <Sparkles size={13} /> Session completed! Thank you for booking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeading({ dot, label }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: dot }} />
      <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">{label}</h2>
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
    setLoading(true); setError('');
    try {
      const res = await api.get('/clients/bookings');
      setBookings(res.data.data || []);
    } catch { setError('Failed to load bookings. Please try again.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePayNow = async (bookingId) => {
    setPaying(bookingId);
    try {
      const res = await api.post(`/clients/bookings/${bookingId}/pay`);
      const { paymentUrl, isTestMode: testMode } = res.data;
      if (testMode !== undefined) setIsTestMode(testMode);
      if (paymentUrl) { window.location.href = paymentUrl; }
      else throw new Error('No payment URL returned');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate payment.');
      setPaying(null);
    }
  };

  const handleComplete = async (bookingId) => {
    if (!window.confirm('Confirm you have received all deliverables to complete this booking?')) return;
    setCompleting(bookingId);
    try {
      await api.patch(`/clients/bookings/${bookingId}/complete`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete booking.');
    } finally { setCompleting(null); }
  };

  const pendingBookings    = bookings.filter(b => b.status === 'PENDING');
  const acceptedBookings   = bookings.filter(b => b.status === 'ACCEPTED');
  const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'PAID');
  const otherBookings      = bookings.filter(b => !['PENDING','ACCEPTED','IN_PROGRESS','PAID'].includes(b.status));
  const completionRequests = inProgressBookings.filter(b => b.completionRequestedByVendor).length;

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-10">

      {/* Hero header */}
      <div className="rounded-3xl mb-6 p-6 sm:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-[0.06]" />
        <div className="absolute top-6 right-28 w-16 h-16 rounded-full bg-white opacity-[0.06]" />
        <div className="relative">
          <p className="text-teal-200 text-sm font-medium mb-1">Track your sessions 📅</p>
          <h1 className="text-3xl font-black text-white">My Bookings</h1>
          <p className="text-teal-100/80 text-sm mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
        </div>

        {/* Alert badges */}
        {(completionRequests > 0 || isTestMode) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {completionRequests > 0 && (
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full text-white animate-pulse"
                style={{ background: 'rgba(139,92,246,0.7)', backdropFilter: 'blur(4px)' }}>
                <Bell size={13} /> {completionRequests} awaiting your confirmation
              </div>
            )}
            {isTestMode && (
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full text-white"
                style={{ background: 'rgba(245,158,11,0.7)', backdropFilter: 'blur(4px)' }}>
                <FlaskConical size={13} /> Test Mode — no real charges
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={30} className="animate-spin text-primary" />
          <p className="text-sm text-gray-400">Loading bookings…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#e6f4f3,#ccfbf1)' }}>
            <Camera size={26} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No bookings yet</h3>
          <p className="text-sm text-gray-400">Browse photographers and book a package to get started.</p>
        </div>
      )}

      {/* Booking sections */}
      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-8">
          {acceptedBookings.length > 0 && (
            <section>
              <SectionHeading dot="#10B981" label="Action Required — Pay Deposit" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedBookings.map(b => <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} onComplete={handleComplete} paying={paying} completing={completing} />)}
              </div>
            </section>
          )}
          {inProgressBookings.length > 0 && (
            <section>
              <SectionHeading dot="#8B5CF6" label="In Progress" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressBookings.map(b => <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} onComplete={handleComplete} paying={paying} completing={completing} />)}
              </div>
            </section>
          )}
          {pendingBookings.length > 0 && (
            <section>
              <SectionHeading dot="#F59E0B" label="Awaiting Response" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBookings.map(b => <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} onComplete={handleComplete} paying={paying} completing={completing} />)}
              </div>
            </section>
          )}
          {otherBookings.length > 0 && (
            <section>
              <SectionHeading dot="#9CA3AF" label="Past Bookings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherBookings.map(b => <BookingCard key={b.id} booking={b} onPayNow={handlePayNow} onComplete={handleComplete} paying={paying} completing={completing} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientBookingsPage;
