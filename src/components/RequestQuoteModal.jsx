import React, { useState } from 'react';
import { X } from 'lucide-react';
import ButtonComponent from './UI/ButtonComponent';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const RequestQuoteModal = ({ isOpen, onClose, vendorId }) => {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    vendorId: vendorId,
    description: '',
    startDate: '',
    estimatedTimeType: 'Hours',
    estimatedTimeValue: '',
    extraEquipment: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {

    setLoading(true);

    // make the date in the formData in ISO-8601 DateTime
    const date = new Date(formData.startDate);
    const isoDate = date.toISOString();

    console.log(formData.vendorId)

    const submitData = {
      ...formData,
      startDate: isoDate
    };

    // call contracts api
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients/contracts`, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      // navigate to contracts page
      window.location.href = '/contracts';


      onClose();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Send An Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-800">
              What do you want*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Hi! I'm planning a wedding with around 30 guests. I'm looking for full coverage of the ceremony and reception, along with high-quality edited photos. I'd love to have you as our photographer for this special day."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-800">
              Date*
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Estimated Time Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-800">
                Estimated Time
              </label>
              <div className="flex w-full border border-gray-300 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden">
                <select
                  name="estimatedTimeType"
                  value={formData.estimatedTimeType}
                  onChange={handleChange}
                  className="px-2 py-2 text-sm text-gray-600 bg-gray-50 border-r border-gray-300 outline-none"
                >
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                </select>
                <input
                  type="number"
                  name="estimatedTimeValue"
                  value={formData.estimatedTimeValue}
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Extra Equipment */}
          <div className="mt-2">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Extra Equipment</h3>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="extraEquipment"
                checked={formData.extraEquipment}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary accent-primary"
              />
              <span className="text-sm font-medium text-gray-800">
                Head Light <span className="text-primary">+950 EGP</span>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-8">
          <ButtonComponent
            label="Cancel"
            type="Outline"
            onClick={onClose}
            className="flex-1 !max-w-none text-gray-600 border-gray-300 hover:bg-gray-50"
          />
          <ButtonComponent
            label="Send"
            type="Solid"
            onClick={handleSubmit}
            className="flex-1 !max-w-none"
            loading={loading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default RequestQuoteModal;
