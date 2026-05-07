import React, { useState } from 'react'
import { MdCheckBox, MdTimer, MdPhoto, MdMovie, MdEdit, MdDelete } from 'react-icons/md'
import { Package, CheckCircle2, AlertCircle, X } from 'lucide-react'
import formatePrice from '../utils/formatePrice'
import ButtonComponent from './UI/ButtonComponent'
import InputComponent from './UI/InputComponent'
import api from '../api/axios'
import BookingModal from './BookingModal'

function PackageCard({ data, type = "client", onUpdate, vendorData }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: data.name,
        price: data.price,
        description: data.description,
        deliveryTime: data.deliveryTime,
        numPhotos: data.numPhotos,
        numVideos: data.numVideos,
        features: data.features || [],
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

    const handleEdit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        api.put(`/vendors/packages/${data.id}`, formData).then((res) => {
            setSuccess(true)
            setTimeout(() => {
                setIsEditModalOpen(false)
                if (onUpdate) onUpdate()
            }, 1500)
        }).catch((err) => {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this package?")) return;

        setLoading(true)
        api.delete(`/vendors/packages/${data.id}`).then((res) => {
            if (onUpdate) onUpdate()
        }).catch((err) => {
            alert(err.response?.data?.message || "Error deleting package")
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative'>
            <div className='flex flex-row justify-between items-start mb-4'>
                <div className='flex flex-col gap-1'>
                    <h3 className='text-xl font-bold text-gray-800'>
                        {data.name}
                    </h3>
                    <div className='text-primary font-semibold text-lg'>
                        {formatePrice(data.price, "EGP")}
                    </div>
                </div>
                {type === "vendor" && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-lg"
                            title="Edit Package"
                        >
                            <MdEdit size={18} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg"
                            title="Delete Package"
                        >
                            <MdDelete size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className='text-gray-500 text-sm mb-6 flex-grow'>
                {data.description}
            </div>

            <div className='grid grid-cols-3 gap-2 mb-6 border-y border-gray-50 py-4'>
                <div className='flex flex-col items-center gap-1'>
                    <MdTimer className='text-gray-400' size={20} />
                    <span className='text-[10px] text-gray-400 uppercase font-medium'>Delivery</span>
                    <span className='text-xs font-semibold'>{data.deliveryTime} Days</span>
                </div>
                <div className='flex flex-col items-center gap-1 border-x border-gray-50'>
                    <MdPhoto className='text-gray-400' size={20} />
                    <span className='text-[10px] text-gray-400 uppercase font-medium'>Photos</span>
                    <span className='text-xs font-semibold'>{data.numPhotos}</span>
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <MdMovie className='text-gray-400' size={20} />
                    <span className='text-[10px] text-gray-400 uppercase font-medium'>Videos</span>
                    <span className='text-xs font-semibold'>{data.numVideos}</span>
                </div>
            </div>

            <div className='space-y-2 mb-6'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>What's Included</p>
                {data.features?.map((feature, index) => (
                    <div key={index} className='flex flex-row items-start gap-2'>
                        <MdCheckBox className='text-primary mt-0.5 shrink-0' size={18} />
                        <span className='text-sm text-gray-600'>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            <div className='mt-auto'>
                {type === "client" ? (
                    <ButtonComponent
                        label="Book"
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full"
                    />
                ) : (
                    <>
                    </>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                packageData={data}
                vendorData={vendorData}
            />

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Edit Package</h2>
                                    <p className="text-xs text-gray-500">Update your service package details</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body - Scrollable */}
                        <form onSubmit={handleEdit} className="p-8 overflow-y-auto custom-scrollbar">
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
                                    <span>Package successfully updated! Closing...</span>
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
                                    label="Update Package"
                                    onClick={handleEdit}
                                    loading={loading}
                                    className="!max-w-none w-full md:w-auto md:px-12"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PackageCard
