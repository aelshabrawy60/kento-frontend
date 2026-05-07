import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import ButtonComponent from './UI/ButtonComponent';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import "react-day-picker/style.css";

const BookingModal = ({ isOpen, onClose, packageData, vendorData }) => {
    const [selectedDate, setSelectedDate] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Convert string dates to Date objects
    const unavailableDays = vendorData?.unavailableDays?.map(date => new Date(date)) || [];

    const handleBooking = async () => {
        if (!selectedDate) {
            setError("Please select a date");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/clients/bookings', {
                packageId: packageData.id,
                date: selectedDate.toISOString(),
            });

            toast.success("Booking requested successfully!");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create booking";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Toaster position="top-center" />
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-md flex flex-col animate-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Book Package</h2>
                            <p className="text-xs text-gray-500">{packageData.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">Select a date for your session</p>
                        {selectedDate && (
                            <p className="text-sm font-semibold text-primary">
                                Selected: {format(selectedDate, 'PPP')}
                            </p>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={[
                                ...unavailableDays,
                                { before: new Date() } // Disable past dates
                            ]}
                            className="rdp-custom"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm w-full">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-3">
                    <ButtonComponent
                        label="Confirm Booking"
                        onClick={handleBooking}
                        loading={loading}
                        disabled={!selectedDate || loading}
                        className="!max-w-none w-full"
                    />
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors py-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
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
        </div>
    );
};

export default BookingModal;
