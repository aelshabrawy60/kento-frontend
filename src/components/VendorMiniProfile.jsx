import React from 'react';
import { Link } from 'react-router-dom';
import { IoChatbubblesSharp } from 'react-icons/io5';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import formatePrice from '../utils/formatePrice';

function VendorMiniProfile({ data }) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <img
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            src={data.user.profilePicture}
            alt={data.user.name}
          />
          {data.rating && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black text-white shadow"
              style={{ background: 'linear-gradient(135deg,#008D87,#005f5b)' }}>
              {data.rating}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-900 truncate leading-tight">{data.user.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
              <BiCategory size={11} /> {data.category}
            </span>
            <span className="text-gray-200">·</span>
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
              <HiOutlineLocationMarker size={11} />
              {data.user.region?.length > 6 ? data.user.region.slice(0, 6) + '..' : data.user.region}
            </span>
          </div>
          <p className="text-xs font-bold text-primary mt-1">
            From {formatePrice(data.price, 'EGP')}
          </p>
        </div>
      </div>

      {/* Chat button */}
      <Link
        to={`/chats/${data.user.id}`}
        onClick={e => e.stopPropagation()}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-200"
      >
        <IoChatbubblesSharp size={16} />
      </Link>
    </div>
  );
}

export default VendorMiniProfile;