import React, { useState, useContext, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthProvider';
import {
  CheckCircle2, XCircle, Loader2, AlertCircle, Clock,
  PlayCircle, Sparkles, BadgeCheck, CheckCheck, RefreshCw,
  Bell, Calendar, Package, TrendingUp, LayoutGrid,
} from 'lucide-react';
import formatePrice from '../../utils/formatePrice';

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',      color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <Clock size={12} /> },
  ACCEPTED:    { label: 'Accepted',     color: '#059669', bg: '#ECFDF5', border: '#6EE7B7', icon: <CheckCircle2 size={12} /> },
  REJECTED:    { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <XCircle size={12} /> },
  PAID:        { label: 'Deposit Paid', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: <CheckCircle2 size={12} /> },
  IN_PROGRESS: { label: 'In Progress',  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: <PlayCircle size={12} /> },
  COMPLETED:   { label: 'Completed',    color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', icon: <CheckCheck size={12} /> },
  CANCELLED:   { label: 'Cancelled',    color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: <XCircle size={12} /> },
};

const STATUS_STRIP = {
  PENDING:     '#F59E0B',
  ACCEPTED:    '#10B981',
  REJECTED:    '#EF4444',
  PAID:        '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED:   '#14B8A6',
  CANCELLED:   '#9CA3AF',
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold">
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Stat Tile ─────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, color, bgColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-200">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: bgColor }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Booking Card ──────────────────────────────────────────────────────────
function BookingRequestCard({ booking, onAccept, onReject, onRequestCompletion, actionLoading }) {
  const clientName  = booking.client?.user?.name  || 'Unknown Client';
  const clientPhoto = booking.client?.user?.profilePicture;
  const pkg         = booking.package;
  const isLoading   = actionLoading === booking.id;
  const isPending   = booking.status === 'PENDING';
  const isAccepted  = booking.status === 'ACCEPTED';
  const isInProgress = booking.status === 'IN_PROGRESS' || booking.status === 'PAID';
  const isCompleted = booking.status === 'COMPLETED';
  const stripColor  = STATUS_STRIP[booking.status] || STATUS_STRIP.PENDING;
  const depositAmount = pkg ? Math.ceil(pkg.price * 0.10) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Status strip */}
      <div className="h-1 w-full" style={{ background: stripColor }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Client row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {clientPhoto ? (
              <img src={clientPhoto} alt={clientName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-white shadow-sm">
                {clientName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{clientName}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{booking.client?.user?.email}</p>
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
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-primary text-sm">{formatePrice(pkg.price, 'EGP')}</span>
              {(isInProgress || isCompleted) && (
                <span className="text-[11px] text-gray-500">
                  Deposit: <span className="font-semibold text-emerald-600">{formatePrice(depositAmount, 'EGP')}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar size={13} className="text-gray-400" />
          <span>{formatDate(booking.serviceDate)}</span>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {isPending && (
            <div className="flex gap-2">
              <button id={`accept-btn-${booking.id}`} onClick={() => onAccept(booking.id)} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white rounded-xl py-2.5 text-xs font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50">
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Accept
              </button>
              <button id={`reject-btn-${booking.id}`} onClick={() => onReject(booking.id)} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 rounded-xl py-2.5 text-xs font-semibold hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-50">
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} Decline
              </button>
            </div>
          )}
          {isAccepted && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <Clock size={13} className="shrink-0" />
              <span>Awaiting client deposit — <strong>{formatePrice(depositAmount, 'EGP')}</strong></span>
            </div>
          )}
          {isInProgress && (
            booking.completionRequestedByVendor ? (
              <div className="flex items-center gap-2 text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5">
                <BadgeCheck size={13} className="shrink-0" />
                <div>
                  <span className="font-semibold block">Completion request sent</span>
                  <span className="text-violet-500">Awaiting client confirmation</span>
                </div>
              </div>
            ) : (
              <button id={`request-complete-btn-${booking.id}`} onClick={() => onRequestCompletion(booking.id)} disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 border border-purple-300 text-purple-700 rounded-xl py-2.5 text-xs font-semibold hover:bg-purple-50 active:scale-[0.98] transition-all disabled:opacity-50">
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Bell size={13} />} Notify Client — Work Done
              </button>
            )
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
              <Sparkles size={13} className="shrink-0" /> Session delivered successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pill Tab ──────────────────────────────────────────────────────────────
function PillTab({ label, count, active, color, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
        active ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
      }`}
      style={active ? { background: color } : {}}>
      <span>{label}</span>
      {count > 0 && (
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
          active ? 'bg-white/25 text-white' : 'bg-gray-300 text-gray-700'
        }`}>{count}</span>
      )}
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
function VendorDashboardPage() {
  const { accessToken } = useContext(AuthContext);
  const [bookings, setBookings]             = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError]   = useState('');
  const [actionLoading, setActionLoading]   = useState(null);
  const [activeTab, setActiveTab]           = useState('pending');

  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true); setBookingsError('');
    try {
      const res = await api.get('/vendors/bookings');
      setBookings(res.data.data || []);
    } catch { setBookingsError('Failed to load booking requests.'); }
    finally { setBookingsLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const pendingBookings    = bookings.filter(b => b.status === 'PENDING');
  const acceptedBookings   = bookings.filter(b => b.status === 'ACCEPTED');
  const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'PAID');
  const completedBookings  = bookings.filter(b => b.status === 'COMPLETED');

  const displayedBookings =
    activeTab === 'pending'    ? pendingBookings :
    activeTab === 'inprogress' ? inProgressBookings :
    bookings;

  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/vendors/bookings/${bookingId}/accept`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b));
    } catch (err) { alert(err.response?.data?.message || 'Failed to accept booking.'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/vendors/bookings/${bookingId}/reject`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'REJECTED' } : b));
    } catch (err) { alert(err.response?.data?.message || 'Failed to decline booking.'); }
    finally { setActionLoading(null); }
  };

  const handleRequestCompletion = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/vendors/bookings/${bookingId}/request-completion`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, completionRequestedByVendor: true } : b));
    } catch (err) { alert(err.response?.data?.message || 'Failed to send completion request.'); }
    finally { setActionLoading(null); }
  };

  const tabColor = activeTab === 'pending' ? '#F59E0B' : activeTab === 'inprogress' ? '#8B5CF6' : '#008D87';

  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl mx-0 mb-6"
        style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.4)' }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.4)' }} />
        <div className="absolute top-8 right-32 w-16 h-16 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.6)' }} />

        <div className="relative p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-teal-100/80 text-sm mt-1">Manage your bookings and track your progress</p>
          </div>
          <button onClick={fetchBookings} disabled={bookingsLoading}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-all backdrop-blur-sm">
            <RefreshCw size={15} className={bookingsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile icon={<Clock size={22} />}        label="Pending"    value={pendingBookings.length}    color="#D97706" bgColor="#FEF3C7" />
        <StatTile icon={<PlayCircle size={22} />}   label="In Progress" value={inProgressBookings.length} color="#7C3AED" bgColor="#EDE9FE" />
        <StatTile icon={<CheckCheck size={22} />}   label="Completed"  value={completedBookings.length}  color="#0D9488" bgColor="#CCFBF1" />
        <StatTile icon={<LayoutGrid size={22} />}   label="Total"      value={bookings.length}           color="#008D87" bgColor="#CCFBF1" />
      </div>

      {/* ── Bookings Section ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden">
        {/* Section header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
          <p className="text-sm text-gray-400 mt-0.5">{bookings.length} total across all statuses</p>
        </div>

        {/* Tabs */}
        <div className="px-6 sm:px-8 py-4 flex gap-2 flex-wrap border-b border-gray-50">
          <PillTab label="Pending"    count={pendingBookings.length}    active={activeTab === 'pending'}    color="#F59E0B" onClick={() => setActiveTab('pending')} />
          <PillTab label="In Progress" count={inProgressBookings.length} active={activeTab === 'inprogress'} color="#8B5CF6" onClick={() => setActiveTab('inprogress')} />
          <PillTab label="All"        count={bookings.length}           active={activeTab === 'all'}        color="#008D87" onClick={() => setActiveTab('all')} />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Loading */}
          {bookingsLoading && (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="text-sm">Loading requests...</span>
            </div>
          )}

          {/* Error */}
          {bookingsError && !bookingsLoading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm">
              <AlertCircle size={18} /> {bookingsError}
            </div>
          )}

          {/* Empty */}
          {!bookingsLoading && !bookingsError && displayedBookings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: activeTab === 'pending' ? '#FEF3C7' : activeTab === 'inprogress' ? '#EDE9FE' : '#F0FDFA' }}>
                {activeTab === 'pending'
                  ? <Clock size={26} style={{ color: '#D97706' }} />
                  : activeTab === 'inprogress'
                  ? <PlayCircle size={26} style={{ color: '#7C3AED' }} />
                  : <TrendingUp size={26} style={{ color: '#0D9488' }} />}
              </div>
              <p className="font-semibold text-gray-700">
                {activeTab === 'pending' ? 'No pending requests' :
                 activeTab === 'inprogress' ? 'No active sessions' : 'No bookings yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                {activeTab === 'pending' ? 'New booking requests from clients will appear here.' :
                 activeTab === 'inprogress' ? 'Paid bookings will appear here once they start.' :
                 'Clients will start booking once they discover your profile.'}
              </p>
            </div>
          )}

          {/* Cards grid */}
          {!bookingsLoading && !bookingsError && displayedBookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBookings.map(booking => (
                <BookingRequestCard
                  key={booking.id}
                  booking={booking}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onRequestCompletion={handleRequestCompletion}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboardPage;
