import React from 'react'
import InputComponent from '../components/UI/InputComponent'
import ButtonComponent from "../components/UI/ButtonComponent"
import api from '../api/axios'
import { Package, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react'

function AddPackage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [success, setSuccess] = React.useState(false)

    const [formData, setFormData] = React.useState({
        name: "",
        price: 500,
        description: "",
        deliveryTime: 2,
        numPhotos: 0,
        numVideos: 0,
        features: [],
    })

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name === "features") {
            const featuresArray = value.split("\n")
            setFormData(prev => ({
                ...prev,
                features: featuresArray
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }))
        }

        if (error) setError(null);
        if (success) setSuccess(false);
    }

    const resetForm = () => {
        setFormData({
            name: "",
            price: 500,
            description: "",
            deliveryTime: 2,
            numPhotos: 0,
            numVideos: 0,
            features: [],
        })
        setError(null)
        setSuccess(false)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        resetForm()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        api.post('/vendors/packages', formData).then((res) => {
            setSuccess(true)
            setTimeout(() => {
                closeModal()
            }, 2000)
        }).catch((err) => {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            {/* Trigger Button */}
            <div className="flex justify-end mb-6">
                <ButtonComponent
                    label="Add New Package"
                    onClick={() => setIsModalOpen(true)}
                    className="!max-w-none md:w-auto md:px-6"
                />
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Create New Package</h2>
                                    <p className="text-xs text-gray-500">Define a service package for your clients</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body - Scrollable */}
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputComponent
                                            type="text"
                                            placeholder="e.g. Wedding Silver Package"
                                            value={formData.name}
                                            onChange={handleChange}
                                            label="name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputComponent
                                            type="text"
                                            placeholder="What does this package include?"
                                            value={formData.description}
                                            onChange={handleChange}
                                            label="description"
                                        />
                                    </div>

                                    <InputComponent
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        label="price"
                                    />

                                    <InputComponent
                                        type="number"
                                        placeholder="Days"
                                        value={formData.deliveryTime}
                                        onChange={handleChange}
                                        label="deliveryTime"
                                    />

                                    <InputComponent
                                        type="number"
                                        placeholder="0"
                                        value={formData.numPhotos}
                                        onChange={handleChange}
                                        label="numPhotos"
                                    />

                                    <InputComponent
                                        type="number"
                                        placeholder="0"
                                        value={formData.numVideos}
                                        onChange={handleChange}
                                        label="numVideos"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="features" className="text-sm font-medium text-gray-700">
                                        Package Features
                                    </label>
                                    <textarea
                                        id="features"
                                        name="features"
                                        value={formData.features.join("\n")}
                                        onChange={handleChange}
                                        placeholder="Enter each feature on a new line"
                                        className="block w-full px-4 py-3 rounded-md border bg-[#F7FBFF] border-[#D4D7E3] text-sm outline-0 min-h-[120px] focus:border-primary transition-colors resize-none"
                                    />
                                    <p className="text-[11px] text-gray-400">Add each item or service included in this package on a separate line.</p>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-4">
                            {success && (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl text-sm animate-in slide-in-from-bottom-2">
                                    <CheckCircle2 size={18} />
                                    <span>Package successfully created! Closing...</span>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm animate-in slide-in-from-bottom-2">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <ButtonComponent
                                    label="Create Package"
                                    onClick={handleSubmit}
                                    loading={loading}
                                    className="!max-w-none w-full md:w-auto md:px-12"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddPackage

