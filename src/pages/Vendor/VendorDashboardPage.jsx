import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthProvider';
import UploadImgs from '../../components/UI/UploadImgs';
import InputComponent from '../../components/UI/InputComponent';
import ButtonComponent from '../../components/UI/ButtonComponent';
import { CheckCircle, Image as ImageIcon, Send } from 'lucide-react';

function VendorDashboardPage() {
    const { accessToken } = useContext(AuthContext);
    
    const [mediaUrls, setMediaUrls] = useState([]);
    const [hashtagsStr, setHashtagsStr] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUpload = (urls) => {
        // UploadImgs returns an array if allowMultiple={true}
        setMediaUrls(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (mediaUrls.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Parse hashtags from comma separated string
            const hashtagsArray = hashtagsStr
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const payload = {
                hashtags: hashtagsArray,
                mediaUrls: mediaUrls
            };

            const response = await api.post('/vendors/posts', payload);

            setSuccess(true);
            setMediaUrls([]);
            setHashtagsStr('');
            // The UploadImgs component state reset isn't directly exposed, but the user can navigate away or upload new imgs.
            
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your portfolio and create new posts.</p>
                    </div>
                </div>

                {/* Create Post Section */}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Media (Images)
                            </label>
                            <UploadImgs 
                                onUpload={handleUpload} 
                                allowMultiple={true} 
                            />
                            {mediaUrls.length > 0 && (
                                <p className="text-sm text-green-600 mt-2 font-medium">
                                    {mediaUrls.length} image(s) ready for post
                                </p>
                            )}
                        </div>

                        <div>
                            <InputComponent 
                                label="Hashtags (comma separated)"
                                placeholder="graphic design, branding, logo"
                                value={hashtagsStr}
                                onChange={(e) => setHashtagsStr(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter tags separated by commas to help clients find your work.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <ButtonComponent 
                                label={
                                    <span className="flex items-center gap-2">
                                        Post to Portfolio <Send size={18} />
                                    </span>
                                }
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
