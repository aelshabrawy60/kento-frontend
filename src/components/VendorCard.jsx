import React from 'react';
import { Link } from 'react-router-dom';
import VendorMiniProfile from './VendorMiniProfile';

function VendorCard({ data }) {
  return (
    <Link
      to={`/vendors/${data.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 to-teal-100">
        {data.topImageUrl && (
          <img
            src={data.topImageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={data.user?.name}
          />
        )}
        {/* Category badge */}
        {data.category && (
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
            {data.category}
          </span>
        )}
        {/* Rating badge */}
        {data.rating && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: 'rgba(0,141,135,0.85)', backdropFilter: 'blur(6px)' }}>
            ⭐ {data.rating}
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="p-4">
        <VendorMiniProfile data={data} />
      </div>
    </Link>
  );
}

export default VendorCard;
