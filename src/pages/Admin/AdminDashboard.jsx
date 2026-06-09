import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

/* ─── Helpers ────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const map = {
    UNDER_REVIEW: { bg: 'rgba(234,179,8,0.15)',  color: '#fbbf24', label: 'Under Review' },
    APPROVED:     { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Approved' },
    REJECTED:     { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: 'Rejected' },
    PENDING:      { bg: 'rgba(234,179,8,0.15)',  color: '#fbbf24', label: 'Pending' },
    ACCEPTED:     { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Accepted' },
    PAID:         { bg: 'rgba(0,212,204,0.15)',  color: '#00d4cc', label: 'Paid' },
    IN_PROGRESS:  { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: 'In Progress' },
    COMPLETED:    { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Completed' },
    CANCELLED:    { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: 'Cancelled' },
  };
  const cfg = map[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', label: status };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
}

function Avatar({ src, name, size = 36 }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4cc,#008D87)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.35, fontWeight: '700', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: '24px 0' }} className="animate-pulse flex flex-col gap-4 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ 
          height: '60px', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '12px' 
        }}></div>
      ))}
    </div>
  );
}

function EmptyState({ msg }) {
  return <div style={{ textAlign: 'center', padding: '64px 24px', color: '#475569', fontSize: '15px' }}>{msg}</div>;
}

/* ─── Vendor Card (mobile) / Row (desktop) ───────────────── */

function VendorItem({ v }) {
  return (
    <>
      {/* Desktop row */}
      <div className="admin-table-row desktop-only" id={`vendor-row-${v.id}`}>
        <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={v.user?.profilePicture} name={v.user?.name} />
          <div>
            <div className="row-name">{v.user?.name || '—'}</div>
            <div className="row-sub">{v.user?.email}</div>
          </div>
        </div>
        <div style={{ flex: 2, color: '#94a3b8', fontSize: '14px' }}>{v.category || '—'}</div>
        <div style={{ flex: 1, textAlign: 'center', color: '#e2e8f0', fontSize: '14px' }}>{v._count?.packages ?? 0}</div>
        <div style={{ flex: 1, textAlign: 'center', color: '#e2e8f0', fontSize: '14px' }}>{v._count?.bookings ?? 0}</div>
        <div style={{ flex: 1, textAlign: 'center', color: '#fbbf24', fontSize: '14px' }}>{v.rating ? `⭐ ${v.rating.toFixed(1)}` : '—'}</div>
        <div style={{ flex: 2, textAlign: 'center' }}><StatusBadge status={v.profileStatus} /></div>
        <div style={{ flex: 2, color: '#64748b', fontSize: '13px' }}>{v.user?.createdAt ? new Date(v.user.createdAt).toLocaleDateString() : '—'}</div>
      </div>

      {/* Mobile card */}
      <div className="mobile-card mobile-only" id={`vendor-card-${v.id}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Avatar src={v.user?.profilePicture} name={v.user?.name} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row-name">{v.user?.name || '—'}</div>
            <div className="row-sub">{v.user?.email}</div>
          </div>
          <StatusBadge status={v.profileStatus} />
        </div>
        <div className="mobile-meta-row">
          {v.category && <span className="mobile-tag">📁 {v.category}</span>}
          {v.rating && <span className="mobile-tag">⭐ {v.rating.toFixed(1)}</span>}
          <span className="mobile-tag">📦 {v._count?.packages ?? 0} pkgs</span>
          <span className="mobile-tag">🗓 {v._count?.bookings ?? 0} bookings</span>
        </div>
        <div className="mobile-date">Joined {v.user?.createdAt ? new Date(v.user.createdAt).toLocaleDateString() : '—'}</div>
      </div>
    </>
  );
}

/* ─── Booking Card (mobile) / Row (desktop) ─────────────── */

function BookingItem({ b }) {
  return (
    <>
      {/* Desktop row */}
      <div className="admin-table-row desktop-only" id={`booking-row-${b.id}`}>
        <div style={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar src={b.client?.user?.profilePicture} name={b.client?.user?.name} size={32} />
          <div>
            <div className="row-name">{b.client?.user?.name || '—'}</div>
            <div className="row-sub">{b.client?.user?.email}</div>
          </div>
        </div>
        <div style={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar src={b.vendor?.user?.profilePicture} name={b.vendor?.user?.name} size={32} />
          <div>
            <div className="row-name">{b.vendor?.user?.name || '—'}</div>
            <div className="row-sub">{b.vendor?.user?.email}</div>
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ color: '#e2e8f0', fontSize: '13px' }}>{b.package?.name || '—'}</div>
          <div style={{ color: '#00d4cc', fontSize: '12px' }}>{b.package?.price ? `EGP ${b.package.price.toLocaleString()}` : ''}</div>
        </div>
        <div style={{ flex: 1.5, textAlign: 'center' }}><StatusBadge status={b.status} /></div>
        <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '13px' }}>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : '—'}</div>
        <div style={{ flex: 1.5, color: '#64748b', fontSize: '13px' }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</div>
      </div>

      {/* Mobile card */}
      <div className="mobile-card mobile-only" id={`booking-card-${b.id}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar src={b.client?.user?.profilePicture} name={b.client?.user?.name} size={28} />
              <div>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Client</div>
                <div className="row-name" style={{ fontSize: '13px' }}>{b.client?.user?.name || '—'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar src={b.vendor?.user?.profilePicture} name={b.vendor?.user?.name} size={28} />
              <div>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Vendor</div>
                <div className="row-name" style={{ fontSize: '13px' }}>{b.vendor?.user?.name || '—'}</div>
              </div>
            </div>
          </div>
          <StatusBadge status={b.status} />
        </div>
        <div className="mobile-meta-row">
          {b.package?.name && <span className="mobile-tag">📦 {b.package.name}</span>}
          {b.package?.price && <span className="mobile-tag">💰 EGP {b.package.price.toLocaleString()}</span>}
          {b.serviceDate && <span className="mobile-tag">📅 {new Date(b.serviceDate).toLocaleDateString()}</span>}
        </div>
        <div className="mobile-date">Booked {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</div>
      </div>
    </>
  );
}

/* ─── Vendors Tab ────────────────────────────────────────── */

function VendorsTab({ vendors, loading }) {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? vendors : vendors.filter(v => v.profileStatus === filter);

  return (
    <div>
      <div className="filter-row">
        {['ALL', 'APPROVED', 'UNDER_REVIEW', 'REJECTED'].map(f => (
          <button key={f} id={`vendor-filter-${f.toLowerCase()}`} onClick={() => setFilter(f)}
            className={`filter-btn${filter === f ? ' active' : ''}`}>
            {f === 'ALL' ? 'All' : f === 'UNDER_REVIEW' ? 'Under Review' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? <LoadingState /> : filtered.length === 0 ? <EmptyState msg="No vendors found" /> : (
        <div className="admin-table">
          <div className="admin-table-head desktop-only">
            <div style={{ flex: 3 }}>Vendor</div>
            <div style={{ flex: 2 }}>Category</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Pkgs</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Bookings</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Rating</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Status</div>
            <div style={{ flex: 2 }}>Joined</div>
          </div>
          {filtered.map(v => <VendorItem key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}

/* ─── Bookings Tab ───────────────────────────────────────── */

function BookingsTab({ bookings, loading }) {
  const [filter, setFilter] = useState('ALL');
  const statuses = ['ALL', 'PENDING', 'ACCEPTED', 'PAID', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'];
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="filter-row">
        {statuses.map(f => (
          <button key={f} id={`booking-filter-${f.toLowerCase()}`} onClick={() => setFilter(f)}
            className={`filter-btn${filter === f ? ' active' : ''}`}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <LoadingState /> : filtered.length === 0 ? <EmptyState msg="No bookings found" /> : (
        <div className="admin-table">
          <div className="admin-table-head desktop-only">
            <div style={{ flex: 2.5 }}>Client</div>
            <div style={{ flex: 2.5 }}>Vendor</div>
            <div style={{ flex: 2 }}>Package</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>Status</div>
            <div style={{ flex: 1.5 }}>Service Date</div>
            <div style={{ flex: 1.5 }}>Booked On</div>
          </div>
          {filtered.map(b => <BookingItem key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}

/* ─── Pending Requests Tab ───────────────────────────────── */

function PendingTab({ vendors, loading, onApprove, onReject }) {
  const pending = vendors.filter(v => v.profileStatus === 'UNDER_REVIEW');
  const [actionLoading, setActionLoading] = useState({});

  const handle = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: action }));
    if (action === 'approve') await onApprove(id);
    else await onReject(id);
    setActionLoading(prev => ({ ...prev, [id]: null }));
  };

  if (loading) return <LoadingState />;
  if (pending.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#4ade80', margin: '0 auto 20px', lineHeight: 1 }}>✓</div>
      <h3 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '600', margin: '0 0 8px' }}>All caught up!</h3>
      <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>No pending vendor requests at this time.</p>
    </div>
  );

  return (
    <div className="pending-grid">
      {pending.map(v => (
        <div key={v.id} className="pending-card" id={`pending-vendor-${v.id}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
            <Avatar src={v.user?.profilePicture} name={v.user?.name} size={52} />
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ color: '#f0f4f8', fontWeight: '600', fontSize: '16px', marginBottom: '2px' }}>{v.user?.name || 'Unknown'}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{v.user?.email}</div>
              {v.user?.phone && <div style={{ color: '#64748b', fontSize: '13px' }}>📞 {v.user.phone}</div>}
            </div>
            <StatusBadge status={v.profileStatus} />
          </div>

          <div className="details-grid">
            {v.category && <Detail label="Category" value={v.category} />}
            {v.experience != null && <Detail label="Experience" value={`${v.experience} yrs`} />}
            {v.price != null && <Detail label="Base Price" value={`EGP ${v.price.toLocaleString()}`} />}
            {v._count?.packages != null && <Detail label="Packages" value={v._count.packages} />}
            {v._count?.portfolioPosts != null && <Detail label="Portfolio" value={`${v._count.portfolioPosts} posts`} />}
            {v.user?.region && <Detail label="Region" value={v.user.region} />}
          </div>

          {v.about && (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '12px' }}>
              <div style={{ color: '#475569', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>About</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>{v.about}</div>
            </div>
          )}

          {v.portfolioUrl && (
            <a href={v.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4cc', fontSize: '13px', textDecoration: 'none' }}>
              🔗 View Portfolio
            </a>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button id={`reject-vendor-${v.id}`} onClick={() => handle(v.id, 'reject')} disabled={!!actionLoading[v.id]} className="reject-btn">
              {actionLoading[v.id] === 'reject' ? '…' : '✕ Reject'}
            </button>
            <button id={`approve-vendor-${v.id}`} onClick={() => handle(v.id, 'approve')} disabled={!!actionLoading[v.id]} className="approve-btn">
              {actionLoading[v.id] === 'approve' ? '…' : '✓ Approve'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px' }}>
      <div style={{ color: '#475569', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{label}</div>
      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>{value}</div>
    </div>
  );
}

/* ─── Categories Tab ─────────────────────────────────────── */

function CategoriesTab({ categories, fetchCategories, showToast, loading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const openModal = (category = null) => {
    setEditCategory(category);
    setName(category ? category.name : '');
    setDescription(category ? (category.description || '') : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditCategory(null);
    setName('');
    setDescription('');
  };

  const handleSave = async () => {
    if (!name.trim()) return showToast('Name is required', false);
    setSaving(true);
    try {
      if (editCategory) {
        await api.patch(`/admin/categories/${editCategory.id}`, { name, description });
        showToast('Category updated');
      } else {
        await api.post('/admin/categories', { name, description });
        showToast('Category created');
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save category', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      showToast('Category deleted');
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete category', false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => openModal()} className="approve-btn" style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Category
        </button>
      </div>

      {loading ? <LoadingState /> : categories.length === 0 ? <EmptyState msg="No categories found" /> : (
        <div className="admin-table">
          <div className="admin-table-head desktop-only">
            <div style={{ flex: 2 }}>Name</div>
            <div style={{ flex: 3 }}>Description</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Actions</div>
          </div>
          {categories.map(c => (
            <div key={c.id} className="admin-table-row">
              <div style={{ flex: 2, color: '#f0f4f8', fontWeight: '500' }}>{c.name}</div>
              <div style={{ flex: 3, color: '#94a3b8', fontSize: '13px' }}>{c.description || '—'}</div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => openModal(c)} style={{ background: 'transparent', border: 'none', color: '#00d4cc', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ margin: '0 0 16px', color: '#f0f4f8' }}>{editCategory ? 'Edit Category' : 'Add Category'}</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={closeModal} className="filter-btn">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="approve-btn" style={{ width: 'auto', padding: '8px 16px' }}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVendors = useCallback(async () => {
    setLoadingVendors(true);
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data.data || []);
    } catch { showToast('Failed to load vendors', false); }
    finally { setLoadingVendors(false); }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.data || []);
    } catch { showToast('Failed to load bookings', false); }
    finally { setLoadingBookings(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data.data || []);
    } catch { showToast('Failed to load categories', false); }
    finally { setLoadingCategories(false); }
  }, []);

  useEffect(() => { fetchVendors(); fetchBookings(); fetchCategories(); }, [fetchVendors, fetchBookings, fetchCategories]);

  const approveVendor = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/approve`);
      setVendors(prev => prev.map(v => v.id === id ? { ...v, profileStatus: 'APPROVED' } : v));
      showToast('Vendor approved ✓');
    } catch { showToast('Failed to approve vendor', false); }
  };

  const rejectVendor = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/reject`);
      setVendors(prev => prev.map(v => v.id === id ? { ...v, profileStatus: 'REJECTED' } : v));
      showToast('Vendor rejected');
    } catch { showToast('Failed to reject vendor', false); }
  };

  const pendingCount = vendors.filter(v => v.profileStatus === 'UNDER_REVIEW').length;

  const tabs = [
    { key: 'pending', label: 'Pending Requests', shortLabel: 'Pending', badge: pendingCount > 0 ? pendingCount : null, icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    )},
    { key: 'vendors', label: 'All Vendors', shortLabel: 'Vendors', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { key: 'bookings', label: 'All Bookings', shortLabel: 'Bookings', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    )},
    { key: 'categories', label: 'Categories', shortLabel: 'Categories', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16"/><path d="M9 4v16"/></svg>
    )},
  ];

  const NavContent = ({ onSelect }) => (
    <>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4cc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">Kentograph</span>
        </div>
        <div className="sidebar-admin-badge">Admin</div>
      </div>

      <nav className="sidebar-nav">
        {tabs.map(t => (
          <button key={t.key} id={`tab-${t.key}`}
            onClick={() => { setTab(t.key); onSelect && onSelect(); }}
            className={`nav-btn${tab === t.key ? ' active' : ''}`}>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
            {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Avatar src={user?.profilePicture} name={user?.name || 'Admin'} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</div>
          <div style={{ color: '#475569', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        </div>
        <button id="admin-logout-btn" onClick={logout} className="logout-btn" title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

        .admin-page {
          display: flex;
          min-height: 100vh;
          background: #08101e;
          font-family: 'Inter','Segoe UI',system-ui,sans-serif;
          color: #e2e8f0;
          position: relative;
        }

        /* ── Sidebar (desktop) ── */
        .admin-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.025);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          gap: 8px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* ── Mobile drawer overlay ── */
        .drawer-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }
        .drawer-overlay.open { display: block; }

        .drawer {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 280px;
          background: #0d1529;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          z-index: 210;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .drawer.open { transform: translateX(0); }

        /* ── Mobile top bar ── */
        .mobile-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: rgba(255,255,255,0.025);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
          flex-shrink: 0;
        }
        .mobile-topbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 15px;
          color: #e2e8f0;
        }
        .hamburger {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }

        /* ── Main ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* ── Page header ── */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px 0;
          flex-shrink: 0;
          gap: 12px;
        }
        .page-title  { margin:0; font-size:26px; font-weight:700; color:#f0f4f8; letter-spacing:-0.4px; }
        .page-subtitle { margin:4px 0 0; color:#475569; font-size:13px; }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Stats ── */
        .stats-row {
          display: flex;
          gap: 16px;
          padding: 24px 32px 0;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 140px;
          background: rgba(255,255,255,0.03);
          border: 1px solid;
          border-radius: 14px;
          padding: 16px 18px;
        }
        .stat-icon  { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .stat-value { font-size:26px; font-weight:700; color:#f0f4f8; line-height:1; }
        .stat-label { font-size:12px; color:#64748b; margin-top:4px; }

        /* ── Content area ── */
        .admin-content {
          flex: 1;
          overflow: auto;
          padding: 24px 32px 32px;
        }

        /* ── Filter row ── */
        .filter-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
        }
        .filter-btn.active {
          background: rgba(0,212,204,0.15);
          border-color: rgba(0,212,204,0.3);
          color: #00d4cc;
        }

        /* ── Table ── */
        .admin-table {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .admin-table-head {
          display: flex;
          padding: 12px 20px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .admin-table-row {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .admin-table-row:hover { background: rgba(255,255,255,0.02); }
        .row-name { color:#e2e8f0; font-size:14px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .row-sub  { color:#475569; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }

        /* ── Mobile cards ── */
        .mobile-card {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 8px 0 6px;
        }
        .mobile-tag {
          padding: 3px 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          font-size: 12px;
          color: #94a3b8;
          white-space: nowrap;
        }
        .mobile-date { font-size: 12px; color: #334155; }

        /* ── Pending cards ── */
        .pending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .pending-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .approve-btn {
          flex: 1;
          padding: 11px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .reject-btn {
          flex: 1;
          padding: 11px;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          color: #f87171;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        /* ── Sidebar internals ── */
        .sidebar-top    { margin-bottom: 24px; padding: 0 8px; }
        .sidebar-logo   { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
        .sidebar-logo-icon { width:36px; height:36px; background:rgba(0,212,204,0.1); border:1px solid rgba(0,212,204,0.2); border-radius:10px; display:flex; align-items:center; justify-content:center; }
        .sidebar-logo-text  { color:#e2e8f0; font-weight:700; font-size:16px; }
        .sidebar-admin-badge { display:inline-block; padding:2px 8px; background:rgba(0,212,204,0.15); color:#00d4cc; border-radius:6px; font-size:11px; font-weight:600; }
        .sidebar-nav  { display:flex; flex-direction:column; gap:4px; flex:1; }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          width: 100%;
          font-family: inherit;
        }
        .nav-btn.active { background:rgba(0,212,204,0.12); color:#00d4cc; }
        .nav-btn:hover:not(:disabled) { opacity:1; transform:none; background:rgba(255,255,255,0.04); color:#94a3b8; }
        .nav-btn.active:hover { background:rgba(0,212,204,0.12); color:#00d4cc; }
        .nav-icon  { flex-shrink:0; display:flex; }
        .nav-label { flex:1; }
        .nav-badge { background:#f59e0b; color:#000; border-radius:20px; padding:1px 7px; font-size:11px; font-weight:700; }
        .sidebar-footer { display:flex; align-items:center; gap:10px; padding:12px; background:rgba(255,255,255,0.03); border-radius:12px; margin-top:auto; }
        .logout-btn { background:transparent; border:none; color:#475569; cursor:pointer; padding:4px; border-radius:6px; display:flex; transition:color 0.2s; flex-shrink:0; }
        .logout-btn:hover { color:#f87171; }

        /* ── Spinner ── */
        .admin-spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(0,212,204,0.2);
          border-top-color: #00d4cc;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: #0d1529;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          padding: 24px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          animation: slideIn 0.3s ease;
        }

        /* ── Toast ── */
        .admin-toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          padding: 12px 20px;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          z-index: 9999;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          animation: slideIn 0.3s ease;
        }

        /* ── show/hide helpers ── */
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }

        /* ── Global hover for action btns ── */
        button:hover:not(:disabled):not(.nav-btn):not(.hamburger):not(.logout-btn):not(.filter-btn) {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        /* ════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════ */

        @media (max-width: 768px) {
          .admin-page { flex-direction: column; }
          .admin-sidebar   { display: none; }
          .mobile-topbar   { display: flex; }

          .admin-header {
            padding: 16px 16px 0;
          }
          .page-title   { font-size: 20px; }
          .page-subtitle { display: none; }

          .stats-row {
            padding: 16px 16px 0;
            gap: 10px;
          }
          .stat-card {
            min-width: calc(50% - 5px);
            flex: 1 1 calc(50% - 5px);
            padding: 12px 14px;
            gap: 10px;
          }
          .stat-icon  { width:36px; height:36px; }
          .stat-value { font-size: 20px; }
          .stat-label { font-size: 11px; }

          .admin-content {
            padding: 16px 12px 80px;
          }

          .filter-row {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            margin-bottom: 14px;
            /* hide scrollbar */
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .filter-row::-webkit-scrollbar { display: none; }

          .desktop-only { display: none !important; }
          .mobile-only  { display: block !important; }

          .admin-table {
            border-radius: 12px;
          }

          .pending-grid {
            grid-template-columns: 1fr;
          }
          .pending-card {
            padding: 16px;
          }
          .details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .admin-toast {
            bottom: 16px;
            right: 16px;
            left: 16px;
            text-align: center;
          }
        }

        @media (max-width: 400px) {
          .stat-card {
            min-width: calc(50% - 5px);
            padding: 10px 12px;
          }
          .stat-value { font-size: 18px; }
          .details-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <aside className="admin-sidebar">
        <NavContent />
      </aside>

      {/* ── Mobile: top bar ── */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-logo">
          <div className="sidebar-logo-icon" style={{ width: 30, height: 30 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4cc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          Kentograph
          <span className="sidebar-admin-badge">Admin</span>
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── Mobile: drawer overlay + panel ── */}
      <div className={`drawer-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`drawer${sidebarOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button className="hamburger" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <NavContent onSelect={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="page-title">{tabs.find(t => t.key === tab)?.label}</h1>
            <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button id="admin-refresh-btn" onClick={() => { fetchVendors(); fetchBookings(); }} className="refresh-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card" style={{ borderColor: '#00d4cc30' }}>
            <div className="stat-icon" style={{ background: '#00d4cc15', color: '#00d4cc' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div><div className="stat-value">{vendors.length}</div><div className="stat-label">Total Vendors</div></div>
          </div>
          <div className="stat-card" style={{ borderColor: '#4ade8030' }}>
            <div className="stat-icon" style={{ background: '#4ade8015', color: '#4ade80' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div><div className="stat-value">{vendors.filter(v => v.profileStatus === 'APPROVED').length}</div><div className="stat-label">Approved</div></div>
          </div>
          <div className="stat-card" style={{ borderColor: '#fbbf2430' }}>
            <div className="stat-icon" style={{ background: '#fbbf2415', color: '#fbbf24' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div><div className="stat-value">{pendingCount}</div><div className="stat-label">Pending Review</div></div>
          </div>
          <div className="stat-card" style={{ borderColor: '#818cf830' }}>
            <div className="stat-icon" style={{ background: '#818cf815', color: '#818cf8' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div><div className="stat-value">{bookings.length}</div><div className="stat-label">Total Bookings</div></div>
          </div>
        </div>

        {/* Tab content */}
        <div className="admin-content">
          {tab === 'categories' && <CategoriesTab categories={categories} fetchCategories={fetchCategories} showToast={showToast} loading={loadingCategories} />}
          {tab === 'vendors'  && <VendorsTab  vendors={vendors}   loading={loadingVendors} />}
          {tab === 'bookings' && <BookingsTab bookings={bookings} loading={loadingBookings} />}
          {tab === 'pending'  && <PendingTab  vendors={vendors}   loading={loadingVendors} onApprove={approveVendor} onReject={rejectVendor} />}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="admin-toast" style={{ background: toast.ok ? 'rgba(34,197,94,0.92)' : 'rgba(239,68,68,0.92)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
