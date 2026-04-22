
import React, { useState } from 'react';
import { X, Loader2, ImagePlus } from 'lucide-react';

function UploadImgs({ onUpload, allowMultiple = false }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState([]);

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) return;

        // Create local previews
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        const updatedPreviews = allowMultiple ? [...previews, ...newPreviews] : newPreviews;
        setPreviews(updatedPreviews);
        
        await uploadToCloudinary(selectedFiles);
        
        // Clear input value so the same file can be selected again if needed
        e.target.value = '';
    };

    const uploadToCloudinary = async (filesToUpload) => {
        setUploading(true);
        setError('');

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            setError('Cloudinary config missing in .env (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET)');
            setUploading(false);
            return;
        }

        try {
            const uploadedUrls = [];
            
            for (const file of filesToUpload) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                } else {
                    throw new Error(data.error?.message || 'Upload failed');
                }
            }

            if (onUpload) {
                // Return array if multiple, otherwise return single string URL
                onUpload(allowMultiple ? uploadedUrls : uploadedUrls[0]);
            }
        } catch (err) {
            console.error('Error uploading to Cloudinary:', err);
            setError(err.message || 'Failed to upload image(s). Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removePreview = (indexToRemove) => {
        setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full">
            <div 
                className={`relative group flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                    uploading 
                    ? 'bg-gray-50 border-gray-300' 
                    : 'bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-lg'
                }`}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    onChange={handleFileChange}
                    multiple={allowMultiple}
                    accept="image/*"
                    disabled={uploading}
                />
                
                <div className="flex flex-col items-center justify-center p-6 text-center z-0 relative">
                    <div className="mb-4 relative">
                        {uploading ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
                            </div>
                        ) : (
                            <div className="bg-blue-100/50 p-4 rounded-full group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                <ImagePlus className="w-8 h-8 text-blue-500" />
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        {uploading ? 'Uploading your images...' : 'Click or drag to upload'}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-[200px]">
                        SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-50/50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {previews.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images</h4>
                    <div className="flex flex-wrap gap-4">
                        {previews.map((preview, index) => (
                            <div 
                                key={index} 
                                className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md hover:scale-105"
                            >
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`} 
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <button
                                    type="button"
                                    onClick={() => removePreview(index)}
                                    className="absolute top-1.5 right-1.5 bg-white text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                                    disabled={uploading}
                                    title="Remove image"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadImgs