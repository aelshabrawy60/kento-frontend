import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthProvider';
import InputComponent from '../../components/UI/InputComponent';
import SelectComponent from '../../components/UI/SelectComponent';
import ButtonComponent from '../../components/UI/ButtonComponent';
import UploadImgs from '../../components/UI/UploadImgs';
import RegionInputComponent from '../../components/UI/RegionInputComponent';
import {
  CheckCircle, Save, User, Briefcase, Camera, MapPin,
  Info, Globe, Image as ImageIcon, Calendar as CalendarIcon,
  AlertCircle, Send, X, CloudUpload, ChevronDown, ChevronUp, Loader2, Star, DollarSign
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import PageLoading from '../../components/Loading/PageLoading';

import { useCategories } from '../../hooks/useCategories';

const TYPES = ['Photographer', 'Videographer', 'Both'];

// ─── Section Card ────────────────────────────────────────────────────────────
function SectionCard({ id, icon, title, accentColor, children, collapsible = false, badge }) {
  const [open, setOpen] = useState(true);
  return (
    <section id={id} className="rounded-3xl border-none overflow-hidden">
      <div
        className={`flex items-center justify-between sm:px-8 py-5 ${collapsible ? 'cursor-pointer select-none' : ''}`}
        onClick={collapsible ? () => setOpen(v => !v) : undefined}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${accentColor}15`, color: accentColor }}>
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 leading-tight">{title}</h2>
            {badge && <p className="text-[11px] text-gray-400 mt-0.5">{badge}</p>}
          </div>
        </div>
        {collapsible && (
          <span className="text-gray-300 hover:text-gray-500 transition-colors">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        )}
      </div>
      <div className={`border-t border-gray-50 transition-all ${!collapsible || open ? '' : 'hidden'}`}>
        <div className="sm:px-8 py-6">{children}</div>
      </div>
    </section>
  );
}

// ─── Info Chip ───────────────────────────────────────────────────────────────
function InfoChip({ icon, label, color = '#6B7280', bg = '#F9FAFB' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}>
      {icon} {label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function VendorProfilePage() {
  useContext(AuthContext);
  const { categories } = useCategories();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', region: '', category: '',
    experience: '', portfolioUrl: '', profilePicture: '',
    price: '', type: 'Photographer', about: '', topImageUrl: '',
  });

  const [unavailableDays, setUnavailableDays] = useState([]);

  // Post modal state
  const [postMediaUrls, setPostMediaUrls] = useState([]);
  const [hashtagsStr, setHashtagsStr]     = useState('');
  const [postLoading, setPostLoading]     = useState(false);
  const [postError, setPostError]         = useState('');
  const [postSuccess, setPostSuccess]     = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/vendors/profile');
      const vendor = data.vendor || {};
      let typeStr = 'Photographer';
      if (vendor.type === 1) typeStr = 'Videographer';
      if (vendor.type === 2) typeStr = 'Both';
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        region: data.region || '',
        category: vendor.category || '',
        experience: vendor.experience?.toString() || '',
        portfolioUrl: vendor.portfolioUrl || '',
        profilePicture: data.profilePicture || '',
        price: vendor.price?.toString() || '',
        type: typeStr,
        about: vendor.about || '',
        topImageUrl: vendor.topImageUrl || '',
      });
      if (vendor.unavailableDays)
        setUnavailableDays(vendor.unavailableDays.map(d => new Date(d)));
    } catch { setError('Failed to load profile data.'); }
    finally { setLoading(false); }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    try {
      let typeInt = 0;
      if (formData.type === 'Videographer') typeInt = 1;
      if (formData.type === 'Both') typeInt = 2;
      await api.put('/vendors/profile', {
        name: formData.name, phone: formData.phone, region: formData.region,
        category: formData.category, experience: parseInt(formData.experience) || 0,
        portfolioUrl: formData.portfolioUrl, profilePicture: formData.profilePicture,
        price: parseFloat(formData.price) || 0, type: typeInt,
        about: formData.about, topImageUrl: formData.topImageUrl,
        unavailableDays: unavailableDays.map(d => d.toISOString()),
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  const handlePostSubmit = async () => {
    if (postMediaUrls.length === 0) { setPostError('Please upload at least one image.'); return; }
    setPostLoading(true); setPostError(''); setPostSuccess(false);
    try {
      const hashtagsArray = hashtagsStr.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/vendors/posts', { hashtags: hashtagsArray, mediaUrls: postMediaUrls });
      setPostSuccess(true);
      setPostMediaUrls([]); setHashtagsStr('');
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally { setPostLoading(false); }
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setPostSuccess(false);
    setPostError('');
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen pb-32">

      {/* ══════════════════════════════════════════════
          HERO BLOCK — cover + overlapping avatar card
      ══════════════════════════════════════════════ */}
      <div className="relative mb-4">

        {/* Cover image */}
        <div className="w-full h-52 sm:h-64 rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #008D87 0%, #003d3b 100%)' }}>
          {formData.topImageUrl && (
            <img src={formData.topImageUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
          {/* Gradient overlay always present */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)' }} />
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white opacity-[0.07]" />
          <div className="absolute top-6 right-28 w-20 h-20 rounded-full bg-white opacity-[0.06]" />

          {/* Upload post — top right */}
          <button id="open-post-modal-btn" onClick={() => setIsPostModalOpen(true)}
            className="absolute top-4 right-4 flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.28)' }}>
            <CloudUpload size={14} /> New Post
          </button>
        </div>

        {/* ── Identity card — overlaps bottom of cover ── */}
        <div className="mx-2 sm:mx-0 -mt-16 relative z-10">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100/80 px-5 sm:px-8 pt-4 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

              {/* Avatar — pulled up to overlap cover */}
              <div className="relative -mt-16 sm:-mt-20 shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-[4px] border-white shadow-xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #008D87 0%, #003d3b 100%)' }}>
                  {formData.profilePicture
                    ? <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <User className="text-white w-10 h-10" />
                      </div>
                  }
                </div>
                {/* Camera badge */}
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-md">
                  <Camera size={12} className="text-white" />
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate leading-tight">
                  {formData.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.region && (
                    <InfoChip icon={<MapPin size={11} />} label={formData.region} color="#6B7280" bg="#F3F4F6" />
                  )}
                  {formData.category && (
                    <InfoChip icon={<Star size={11} />} label={formData.category} color="#008D87" bg="#E6F4F3" />
                  )}
                  {formData.type && (
                    <InfoChip
                      icon={formData.type === 'Videographer' ? '🎥' : '📷'}
                      label={formData.type}
                      color="#7C3AED"
                      bg="#F5F3FF"
                    />
                  )}
                  {formData.experience && (
                    <InfoChip icon={<Briefcase size={11} />} label={`${formData.experience} yrs exp`} color="#2563EB" bg="#EFF6FF" />
                  )}
                  {formData.price && (
                    <InfoChip icon={<DollarSign size={11} />} label={`From ${Number(formData.price).toLocaleString()} EGP`} color="#D97706" bg="#FFFBEB" />
                  )}
                </div>
                {formData.about && (
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed line-clamp-2 max-w-xl">
                    {formData.about}
                  </p>
                )}
              </div>

              {/* Portfolio link */}
              {formData.portfolioUrl && (
                <a href={formData.portfolioUrl} target="_blank" rel="noreferrer"
                  className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors">
                  <Globe size={13} /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="space-y-3 mb-5 mx-2 sm:mx-0">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-4 py-3 text-sm">
            <CheckCircle size={16} className="shrink-0 text-emerald-500" /> Profile updated successfully!
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          FORM SECTIONS
      ══════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="space-y-4 mx-2 sm:mx-0">

        {/* ── Basic Information ── */}
        <SectionCard
          id="basic"
          icon={<User size={18} />}
          title="Basic Information"
          badge="Name, phone & location"
          accentColor="#3B82F6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputComponent label="Full Name" placeholder="e.g. John Doe"
              value={formData.name} onChange={e => handleChange('name', e.target.value)} />
            <InputComponent label="Phone Number" placeholder="e.g. 01234567890"
              value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
            <div className="sm:col-span-2">
              <RegionInputComponent label="Region / City"
                region={formData.region} setRegion={val => handleChange('region', val)} />
            </div>
          </div>
        </SectionCard>

        {/* ── Professional Details ── */}
        <SectionCard
          id="professional"
          icon={<Briefcase size={18} />}
          title="Professional Details"
          badge="Category, type, pricing & bio"
          accentColor="#8B5CF6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectComponent label="Specialization" options={categories}
              selectedVal={formData.category} handleChange={val => handleChange('category', val)} />
            <SelectComponent label="Service Type" options={TYPES}
              selectedVal={formData.type} handleChange={val => handleChange('type', val)} />
            <InputComponent label="Years of Experience" type="number" placeholder="e.g. 5"
              value={formData.experience} onChange={e => handleChange('experience', e.target.value)} />
            <InputComponent label="Base Price (EGP)" type="number" placeholder="e.g. 3000"
              value={formData.price} onChange={e => handleChange('price', e.target.value)} />
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                <Info size={14} /> About You
              </label>
              <textarea
                rows={4}
                className="block w-full px-4 py-3 rounded-xl border bg-[#F7FBFF] border-[#D4D7E3] text-sm outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
                placeholder="Tell clients about your work style, equipment, and what makes you unique…"
                value={formData.about}
                onChange={e => handleChange('about', e.target.value)}
              />
              <p className="text-[11px] text-gray-400 mt-1.5 ml-1">This appears on your public profile for clients to read.</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Media & Links ── */}
        <SectionCard
          id="media"
          icon={<Camera size={18} />}
          title="Media & Links"
          badge="Profile photo, cover & portfolio URL"
          accentColor="#F97316"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Profile picture upload */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <User size={12} /> Profile Photo
                </label>
                {formData.profilePicture && (
                  <img src={formData.profilePicture} alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover mb-3 border-2 border-white shadow-sm" />
                )}
                <UploadImgs onUpload={url => handleChange('profilePicture', url)} allowMultiple={false} />
              </div>
              {/* Cover photo upload */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <ImageIcon size={12} /> Cover Photo
                </label>
                {formData.topImageUrl && (
                  <img src={formData.topImageUrl} alt="Cover Preview"
                    className="w-full h-14 rounded-xl object-cover mb-3 border-2 border-white shadow-sm" />
                )}
                <UploadImgs onUpload={url => handleChange('topImageUrl', url)} allowMultiple={false} />
              </div>
            </div>
            <InputComponent label="Portfolio URL" placeholder="https://behance.net/yourprofile"
              icon={<Globe size={16} />}
              value={formData.portfolioUrl} onChange={e => handleChange('portfolioUrl', e.target.value)} />
          </div>
        </SectionCard>

        {/* ── Availability ── */}
        <SectionCard
          id="availability"
          icon={<CalendarIcon size={18} />}
          title="Availability"
          badge="Block dates you're not available"
          accentColor="#EF4444"
          collapsible
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Calendar */}
            <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shrink-0 self-start">
              <DayPicker
                mode="multiple"
                selected={unavailableDays}
                onSelect={days => { setUnavailableDays(days || []); setSuccess(false); }}
                disabled={{ before: new Date() }}
                className="rdp-custom"
              />
            </div>
            {/* Info + chips */}
            <div className="flex-1 space-y-4 pt-1">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Block unavailable dates</p>
                  <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                    Clients won't be able to book you on blocked dates. Click any date to toggle it.
                  </p>
                </div>
              </div>

              {unavailableDays.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    {unavailableDays.length} date{unavailableDays.length > 1 ? 's' : ''} blocked
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unavailableDays.sort((a, b) => a - b).slice(0, 10).map((date, i) => (
                      <span key={i}
                        className="text-[11px] px-3 py-1.5 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </span>
                    ))}
                    {unavailableDays.length > 10 && (
                      <span className="text-[11px] px-3 py-1.5 bg-gray-100 rounded-xl text-gray-500 font-semibold">
                        +{unavailableDays.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                  <CheckCircle size={15} className="shrink-0 text-emerald-500" />
                  You're fully available — no dates blocked.
                </div>
              )}
            </div>
          </div>
        </SectionCard>

      </form>

      {/* ── Floating Save ── */}
      <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50">
        <button id="save-profile-btn" onClick={handleSubmit} disabled={saving}
          className="group flex items-center gap-2.5 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}>
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
            : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      {/* ── Calendar CSS ── */}
      <style>{`
        .rdp-custom { --rdp-accent-color: #008D87; --rdp-background-color: #e6f4f3; margin: 0; }
        .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: white !important; }
        .rdp-day_today { color: var(--rdp-accent-color); font-weight: bold; }
      `}</style>

      {/* ══════════════════════════════════════════════
          CREATE POST MODAL
      ══════════════════════════════════════════════ */}
      {isPostModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) closePostModal(); }}
        >
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg flex flex-col overflow-hidden"
            style={{ maxHeight: '88vh', animation: 'slideUp 0.28s cubic-bezier(0.34,1.3,0.64,1)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ImageIcon size={17} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">New Portfolio Post</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Share your work with potential clients</p>
                </div>
              </div>
              <button onClick={closePostModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={17} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              {postError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-xs font-medium">
                  <AlertCircle size={14} className="shrink-0" /> {postError}
                </div>
              )}
              {postSuccess ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <p className="font-bold text-gray-800">Post Published!</p>
                  <p className="text-xs text-gray-400">Your work is now visible to potential clients.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Post Images</label>
                    <UploadImgs onUpload={urls => setPostMediaUrls(urls)} allowMultiple={true} />
                    {postMediaUrls.length > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold mt-2">
                        ✓ {postMediaUrls.length} image{postMediaUrls.length > 1 ? 's' : ''} ready
                      </p>
                    )}
                  </div>
                  <div>
                    <InputComponent
                      label="Hashtags (comma separated)"
                      placeholder="e.g. wedding, fashion, outdoor"
                      value={hashtagsStr}
                      onChange={e => setHashtagsStr(e.target.value)}
                    />
                    <p className="text-[11px] text-gray-400 mt-1 ml-0.5">Tags help clients discover your work.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <button onClick={closePostModal}
                className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors">
                {postSuccess ? 'Close' : 'Cancel'}
              </button>
              {!postSuccess && (
                <ButtonComponent
                  label={<span className="flex items-center gap-2">Publish <Send size={14} /></span>}
                  onClick={handlePostSubmit}
                  loading={postLoading}
                  className="!w-auto px-6 shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default VendorProfilePage;
