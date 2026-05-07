import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../../components/UI/InputComponent';
import SelectComponent from '../../components/UI/SelectComponent';
import ButtonComponent from '../../components/UI/ButtonComponent';
import UploadImgs from '../../components/UI/UploadImgs';
import RegionInputComponent from '../../components/UI/RegionInputComponent';
import { AuthContext } from '../../context/AuthProvider';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const CATEGORIES = ["Fashion", "Wedding", "Product", "Portrait", "Event", "Real Estate", "Other"];
const TYPES = ["Photographer", "Videographer", "Both"];

function VendorOnboardPage() {
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        region: '',
        category: '',
        experience: '',
        portfolioUrl: '',
        profilePicture: '',
        price: '',
        type: '',
        about: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = (currentStep) => {
        if (currentStep === 1) {
            if (!formData.name.trim()) return "Full Name is required";
            if (!formData.phone || formData.phone.length < 10) return "Valid Phone Number is required";
            if (!formData.region) return "Region is required";
        }
        if (currentStep === 2) {
            if (!formData.category) return "Category is required";
            if (!formData.type) return "Type is required";
            if (formData.experience === '' || parseInt(formData.experience) < 0) return "Valid Experience is required";
            if (formData.price === '' || parseFloat(formData.price) <= 0) return "Valid Base Price is required";
            if (!formData.about.trim()) return "About You section is required";
        }
        if (currentStep === 3) {
            if (!formData.profilePicture) return "Profile Picture is required";
            if (!formData.portfolioUrl.trim()) return "Portfolio URL is required";
        }
        return null;
    };

    const nextStep = () => {
        const errorMsg = validateStep(step);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        setError("");
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        const errorMsg = validateStep(3);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setLoading(true);
        setError("");
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
                about: formData.about
            };

            const response = await api.post('/vendors/onboard', payload);

            // Assuming successful onboarding redirects to profile or dashboard
            navigate('/vendor/profile'); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong during onboarding.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicators = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    } transition-colors duration-300`}>
                        {step > num ? <CheckCircle size={20} /> : num}
                    </div>
                    {num < 3 && (
                        <div className={`h-1 w-16 mx-2 transition-colors duration-300 ${
                            step > num ? 'bg-primary' : 'bg-gray-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Vendor Onboarding</h1>
                <p className="text-center text-gray-500 mb-10">Join us as a professional creator and start receiving bookings.</p>
                
                {renderStepIndicators()}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Basic Information</h2>
                            <div className="space-y-5">
                                <InputComponent 
                                    label="Full Name" 
                                    placeholder="Mohamed Gamal"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                                <InputComponent 
                                    label="Phone Number" 
                                    placeholder="01234567890"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                                <RegionInputComponent 
                                    label="Region" 
                                    region={formData.region}
                                    setRegion={(val) => handleChange('region', val)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Professional Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    placeholder="3"
                                    type="number"
                                    value={formData.experience}
                                    onChange={(e) => handleChange('experience', e.target.value)}
                                />
                                <InputComponent 
                                    label="Base Price (EGP)" 
                                    placeholder="1200"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
                                    <textarea
                                        className="block w-full max-w-96 px-4 py-2 rounded-md border bg-[#F7FBFF] border-[#D4D7E3] sm:text-sm outline-0 min-h-[120px] resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="I'm a professional fashion photographer..."
                                        value={formData.about}
                                        onChange={(e) => handleChange('about', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Media & Portfolio</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                    <div className="max-w-96">
                                        <UploadImgs 
                                            onUpload={(url) => handleChange('profilePicture', url)} 
                                            allowMultiple={false} 
                                        />
                                    </div>
                                    {formData.profilePicture && (
                                        <p className="text-sm text-green-600 mt-3 flex items-center gap-1 font-medium bg-green-50 p-2 rounded-lg w-max">
                                            <CheckCircle size={16} /> Image uploaded successfully
                                        </p>
                                    )}
                                </div>
                                <InputComponent 
                                    label="Portfolio URL" 
                                    placeholder="https://behance.net/yourprofile"
                                    value={formData.portfolioUrl}
                                    onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
                    {step > 1 ? (
                        <button
                            onClick={prevStep}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} className="mr-1" /> Back
                        </button>
                    ) : (
                        <div /> // Placeholder to maintain flex-between
                    )}

                    {step < 3 ? (
                        <ButtonComponent
                            label={<span className="flex items-center">Next <ChevronRight size={18} className="ml-1" /></span>}
                            onClick={nextStep}
                            className="!w-auto !max-w-none px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        />
                    ) : (
                        <ButtonComponent
                            label="Complete Onboarding"
                            onClick={handleSubmit}
                            loading={loading}
                            className="!w-auto !max-w-none px-8 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default VendorOnboardPage;