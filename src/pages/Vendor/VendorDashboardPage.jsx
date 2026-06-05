import React, { useState, useContext, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthProvider';
import UploadImgs from '../../components/UI/UploadImgs';
import InputComponent from '../../components/UI/InputComponent';
import ButtonComponent from '../../components/UI/ButtonComponent';
import {
  CheckCircle, Image as ImageIcon, Send, Calendar, Package,
  Clock, CheckCircle2, XCircle, Loader2, AlertCircle, Camera,
  Bell, RefreshCw
} from 'lucide-react';
import formatePrice from '../../utils/formatePrice';

// ─── Status Badge ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: <Clock size={13} /> },
  ACCEPTED: { label: 'Accepted',  color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200', icon: <CheckCircle2 size={13} /> },
  REJECTED: { label: 'Rejected',  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: <XCircle size={13} /> },
  PAID:     { label: 'Paid',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: <CheckCircle2 size={13} /> },
  IN_PROGRESS:{ label: 'In Progress', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <Loader2 size={13} className="animate-spin" /> },
  COMPLETED:{ label: 'Completed', color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200',   icon: <CheckCircle2 size={13} /> },
  CANCELLED:{ label: 'Cancelled', color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',   icon: <XCircle size={13} /> },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Single Booking Request Card ─────────────────────────────────────────────
function BookingRequestCard({ booking, onAccept, onReject, actionLoading }) {
  const clientName = booking.client?.user?.name || 'Unknown Client';
  const clientPhoto = booking.client?.user?.profilePicture;
  const pkg = booking.package;
  const isLoading = actionLoading === booking.id;
  const isPending = booking.status === 'PENDING';

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      isPending ? 'border-amber-200 shadow-sm hover:shadow-md' : 'border-gray-100 opacity-75'
    }`}>
      {/* Top accent */}
      <div className={`h-1 w-full ${
        booking.status === 'ACCEPTED' ? 'bg-emerald-400' :
        booking.status === 'REJECTED' ? 'bg-red-400' :
        'bg-amber-400'
      }`} />

      <div className="p-5">
        {/* Client Info */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {clientPhoto ? (
              <img src={clientPhoto} alt={clientName} className="w-11 h-11 rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">
                {clientName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 text-sm">{clientName}</p>
              <p className="text-xs text-gray-400">{booking.client?.user?.email}</p>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Package Info */}
        {pkg && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Package size={13} className="text-primary" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Package</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{pkg.name}</p>
            <div className="font-bold text-primary mt-1">{formatePrice(pkg.price, 'EGP')}</div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar size={14} />
          <span>Session: {formatDate(booking.serviceDate)}</span>
        </div>

        {/* Accept / Reject Buttons — only for pending */}
        {isPending && (
          <div className="flex gap-3">
            <button
              id={`accept-btn-${booking.id}`}
              onClick={() => onAccept(booking.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Accept
            </button>
            <button
              id={`reject-btn-${booking.id}`}
              onClick={() => onReject(booking.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 text-red-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function VendorDashboardPage() {
  const { accessToken } = useContext(AuthContext);

  // ── Bookings state ──
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'

  // ── Post state ──
  const [mediaUrls, setMediaUrls] = useState([]);
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── Fetch bookings ──
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError('');
    try {
      const res = await api.get('/vendors/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setBookingsError('Failed to load booking requests.');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const displayedBookings = activeTab === 'pending' ? pendingBookings : bookings;

  // ── Accept / Reject ──
  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/vendors/bookings/${bookingId}/accept`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept booking.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/vendors/bookings/${bookingId}/reject`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'REJECTED' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline booking.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Post Handlers ──
  const handleUpload = (urls) => { setMediaUrls(urls); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mediaUrls.length === 0) { setError('Please upload at least one image.'); return; }
    setLoading(true); setError(''); setSuccess(false);
    try {
      const hashtagsArray = hashtagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
      await api.post('/vendors/posts', { hashtags: hashtagsArray, mediaUrls });
      setSuccess(true); setMediaUrls([]); setHashtagsStr('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage booking requests and your portfolio.</p>
          </div>
          {pendingBookings.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
              <Bell size={16} className="text-amber-500" />
              <span className="text-amber-700 font-semibold text-sm">{pendingBookings.length} pending</span>
            </div>
          )}
        </div>

        {/* ── Booking Requests Section ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Camera className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Booking Requests</h2>
                <p className="text-sm text-gray-400">{bookings.length} total · {pendingBookings.length} pending</p>
              </div>
            </div>
            <button
              onClick={fetchBookings}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={bookingsLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending {pendingBookings.length > 0 && `(${pendingBookings.length})`}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Bookings {bookings.length > 0 && `(${bookings.length})`}
            </button>
          </div>

          {/* Loading */}
          {bookingsLoading && (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span>Loading requests...</span>
            </div>
          )}

          {/* Error */}
          {bookingsError && !bookingsLoading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
              <AlertCircle size={18} /> <span>{bookingsError}</span>
            </div>
          )}

          {/* Empty state */}
          {!bookingsLoading && !bookingsError && displayedBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                {activeTab === 'pending' ? 'No pending requests' : 'No bookings yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'pending' ? 'New booking requests will appear here.' : 'Clients will start booking once they discover your profile.'}
              </p>
            </div>
          )}

          {/* Booking Cards Grid */}
          {!bookingsLoading && !bookingsError && displayedBookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBookings.map(booking => (
                <BookingRequestCard
                  key={booking.id}
                  booking={booking}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Create Post Section ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ImageIcon className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Create New Post</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Post created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media (Images)</label>
              <UploadImgs onUpload={handleUpload} allowMultiple={true} />
              {mediaUrls.length > 0 && (
                <p className="text-sm text-green-600 mt-2 font-medium">{mediaUrls.length} image(s) ready for post</p>
              )}
            </div>

            <div>
              <InputComponent
                label="Hashtags (comma separated)"
                placeholder="graphic design, branding, logo"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Enter tags separated by commas to help clients find your work.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <ButtonComponent
                label={<span className="flex items-center gap-2">Post to Portfolio <Send size={18} /></span>}
                type="submit"
                loading={loading}
                className="!w-auto px-8 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              />
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default VendorDashboardPage;
