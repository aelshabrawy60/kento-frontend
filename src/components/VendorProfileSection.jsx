import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChatbubblesSharp } from 'react-icons/io5';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import { Star, Briefcase, Globe } from 'lucide-react';
import formatePrice from '../utils/formatePrice';
import { AuthContext } from '../context/AuthProvider';
import RequestQuoteModal from './RequestQuoteModal';

function VendorProfileSection({ data: { user: { name, profilePicture, region, id }, rating, category, price, about, id: vendorId, experience, portfolioUrl, type } }) {
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const typeLabel = type === 0 ? 'Photographer' : type === 1 ? 'Videographer' : type === 2 ? 'Photo & Video' : null;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #008D87 0%, #003d3b 100%)' }}>
              👤
            </div>
          )}
          {rating && (
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #008D87, #005f5b)' }}>
              <Star size={10} fill="white" /> {rating}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">{name}</h1>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mt-2.5">
            {category && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <BiCategory size={11} /> {category}
              </span>
            )}
            {typeLabel && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                {type === 1 ? '🎥' : '📷'} {typeLabel}
              </span>
            )}
            {region && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                <HiOutlineLocationMarker size={11} /> {region}
              </span>
            )}
            {experience > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                <Briefcase size={11} /> {experience} yrs exp
              </span>
            )}
          </div>

          {/* Price */}
          <p className="text-primary font-black text-lg mt-3">
            From <span>{formatePrice(price, 'EGP')}</span>
          </p>

          {/* About */}
          {about && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-lg line-clamp-3">{about}</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={() => navigate(`/chats/${id}`)}
          className="flex w-full items-center justify-center md:max-w-xs gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
          style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}
        >
          <IoChatbubblesSharp size={16} /> Message
        </button>
      </div>

      <RequestQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} vendorId={vendorId} />
    </div>
  );
}

export default VendorProfileSection;