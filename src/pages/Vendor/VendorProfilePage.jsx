import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthProvider';
import InputComponent from '../../components/UI/InputComponent';
import SelectComponent from '../../components/UI/SelectComponent';
import ButtonComponent from '../../components/UI/ButtonComponent';
import UploadImgs from '../../components/UI/UploadImgs';
import RegionInputComponent from '../../components/UI/RegionInputComponent';
import { CheckCircle, Save, User, Briefcase, Camera, MapPin, Phone, Info, Globe, Image as ImageIcon, Calendar as CalendarIcon, AlertCircle, Send, Plus, X, CloudUpload } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";

const CATEGORIES = ["Fashion", "Wedding", "Product", "Portrait", "Event", "Real Estate", "Other"];
const TYPES = ["Photographer", "Videographer", "Both"];

function VendorProfilePage() {
    const { accessToken } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        region: '',
        category: '',
        experience: '',
        portfolioUrl: '',
        profilePicture: '',
        price: '',
        type: 'Photographer',
        about: '',
        topImageUrl: '',
    });

    const [unavailableDays, setUnavailableDays] = useState([]);

    // Create Post State
    const [postMediaUrls, setPostMediaUrls] = useState([]);
    const [hashtagsStr, setHashtagsStr] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState('');
    const [postSuccess, setPostSuccess] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/vendors/profile');

            const data = response.data;
            const vendor = data.vendor || {};

            let typeStr = "Photographer";
            if (vendor.type === 1) typeStr = "Videographer";
            if (vendor.type === 2) typeStr = "Both";

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

            if (vendor.unavailableDays) {
                setUnavailableDays(vendor.unavailableDays.map(d => new Date(d)));
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            let typeInt = 0;
            if (formData.type === "Videographer") typeInt = 1;
            if (formData.type === "Both") typeInt = 2;

            const payload = {
                name: formData.name,
                phone: formData.phone,
                region: formData.region,
                category: formData.category,
                experience: parseInt(formData.experience) || 0,
                portfolioUrl: formData.portfolioUrl,
                profilePicture: formData.profilePicture,
                price: parseFloat(formData.price) || 0,
                type: typeInt,
                about: formData.about,
                topImageUrl: formData.topImageUrl,
                unavailableDays: unavailableDays.map(d => d.toISOString())
            };

            await api.put('/vendors/profile', payload);

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (postMediaUrls.length === 0) {
            setPostError('Please upload at least one image.');
            return;
        }

        setPostLoading(true);
        setPostError('');
        setPostSuccess(false);

        try {
            const hashtagsArray = hashtagsStr
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const payload = {
                hashtags: hashtagsArray,
                mediaUrls: postMediaUrls
            };

            await api.post('/vendors/posts', payload);

            setPostSuccess(true);
            setPostMediaUrls([]);
            setHashtagsStr('');
        } catch (err) {
            console.error('Error creating post:', err);
            setPostError(err.response?.data?.message || "Failed to create post. Please try again.");
        } finally {
            setPostLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20">
            {/* Profile Header / Cover */}
            <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                {formData.topImageUrl ? (
                    <img src={formData.topImageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                        <ImageIcon className="text-gray-400 w-12 h-12" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Picture Overlay */}
                <div className="relative -mt-24 mb-8 flex flex-col md:flex-row md:items-end gap-6">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <User className="text-gray-400 w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pb-2 flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'Vendor Name'}</h1>
                        <p className="text-gray-600 flex items-center gap-1">
                            <MapPin size={16} /> {formData.region || 'Region not set'}
                        </p>
                    </div>
                    <div className="pb-2">
                        <ButtonComponent
                            onClick={() => setIsPostModalOpen(true)}
                            label={
                                <span className="flex items-center gap-2">
                                    <CloudUpload size={18} /> Upload New Post
                                </span>
                            }
                            className="!w-auto shadow-md hover:shadow-lg transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Profile updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputComponent
                                label="Full Name"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                            <InputComponent
                                label="Phone Number"
                                placeholder="e.g. 01234567890"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                            <RegionInputComponent
                                label="Region"
                                region={formData.region}
                                setRegion={(val) => handleChange('region', val)}
                            />
                        </div>
                    </section>

                    {/* Professional Details */}
                    <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Professional Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectComponent
                                label="Category"
                                options={CATEGORIES}
                                selectedVal={formData.category}
                                handleChange={(val) => handleChange('category', val)}
                            />
                            <SelectComponent
                                label="Type"
                                options={TYPES}
                                selectedVal={formData.type}
                                handleChange={(val) => handleChange('type', val)}
                            />
                            <InputComponent
                                label="Years of Experience"
                                type="number"
                                value={formData.experience}
                                onChange={(e) => handleChange('experience', e.target.value)}
                            />
                            <InputComponent
                                label="Base Price (EGP)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <Info size={16} /> About You
                                </label>
                                <textarea
                                    className="block w-full px-4 py-3 rounded-xl border bg-[#F7FBFF] border-[#D4D7E3] sm:text-sm outline-0 min-h-[150px] resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Tell clients about your work style, equipment, and personality..."
                                    value={formData.about}
                                    onChange={(e) => handleChange('about', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Availability / Block Dates */}
                    <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-red-50 p-2 rounded-lg text-red-600">
                                <CalendarIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Availability</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <DayPicker
                                    mode="multiple"
                                    selected={unavailableDays}
                                    onSelect={(days) => {
                                        setUnavailableDays(days || []);
                                        setSuccess(false);
                                    }}
                                    disabled={{ before: new Date() }}
                                    className="rdp-custom"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-primary" />
                                    Manage Your Calendar
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Select the dates when you are unavailable for bookings.
                                    Clients will not be able to book you on these days.
                                    You can select multiple dates by clicking on them.
                                </p>
                                {unavailableDays.length > 0 && (
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <p className="text-sm font-medium text-primary mb-2">
                                            {unavailableDays.length} dates blocked:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {unavailableDays.sort((a, b) => a - b).slice(0, 6).map((date, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-white border border-primary/20 rounded-md text-primary">
                                                    {date.toLocaleDateString()}
                                                </span>
                                            ))}
                                            {unavailableDays.length > 6 && (
                                                <span className="text-[10px] px-2 py-1 bg-white border border-primary/20 rounded-md text-primary">
                                                    +{unavailableDays.length - 6} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Media & Links */}
                    <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                <Camera size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Media & Links</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <User size={16} /> Profile Picture
                                    </label>
                                    <UploadImgs
                                        onUpload={(url) => handleChange('profilePicture', url)}
                                        allowMultiple={false}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <ImageIcon size={16} /> Cover Image
                                    </label>
                                    <UploadImgs
                                        onUpload={(url) => handleChange('topImageUrl', url)}
                                        allowMultiple={false}
                                    />
                                </div>
                            </div>
                            <InputComponent
                                label="Portfolio URL"
                                placeholder="https://behance.net/yourprofile"
                                icon={<Globe size={18} />}
                                value={formData.portfolioUrl}
                                onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                            />
                        </div>
                    </section>


                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <ButtonComponent
                            onClick={handleSubmit}
                            label={
                                <span className="flex items-center gap-2 px-4">
                                    <Save size={18} /> Save Changes
                                </span>
                            }
                            type="submit"
                            loading={saving}
                            className="!w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        />
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .rdp-custom {
                    --rdp-accent-color: #008D87;
                    --rdp-background-color: #e6f4f3;
                    margin: 0;
                }
                .rdp-day_selected {
                    background-color: var(--rdp-accent-color) !important;
                    color: white !important;
                }
                .rdp-day_today {
                    color: var(--rdp-accent-color);
                    font-weight: bold;
                }
            `}} />

            {/* Create Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-2xl flex flex-col animate-in zoom-in duration-200 max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <ImageIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
                                    <p className="text-xs text-gray-500">Share your latest work with potential clients</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsPostModalOpen(false);
                                    setPostSuccess(false);
                                    setPostError('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto">
                            {postError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                                    {postError}
                                </div>
                            )}

                            {postSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Post created successfully!
                                </div>
                            )}

                            {!postSuccess && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Post Images
                                        </label>
                                        <UploadImgs
                                            onUpload={(urls) => setPostMediaUrls(urls)}
                                            allowMultiple={true}
                                        />
                                        {postMediaUrls.length > 0 && (
                                            <p className="text-sm text-green-600 mt-2 font-medium">
                                                {postMediaUrls.length} image(s) ready for post
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <InputComponent
                                            label="Hashtags (comma separated)"
                                            placeholder="e.g. wedding, fashion, outdoor"
                                            value={hashtagsStr}
                                            onChange={(e) => setHashtagsStr(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tags help clients find your work more easily.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsPostModalOpen(false);
                                    setPostSuccess(false);
                                    setPostError('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                {postSuccess ? 'Close' : 'Cancel'}
                            </button>
                            {!postSuccess && (
                                <ButtonComponent
                                    label={
                                        <span className="flex items-center gap-2">
                                            Post to Portfolio <Send size={18} />
                                        </span>
                                    }
                                    onClick={handlePostSubmit}
                                    loading={postLoading}
                                    className="!w-auto px-6 shadow-md hover:shadow-lg transition-all"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VendorProfilePage;
