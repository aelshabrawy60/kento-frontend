import React from 'react'
import ButtonComponent from './UI/ButtonComponent'
import { useNavigate } from 'react-router-dom'

function VendorProfileSection({ data: { user: { name, profilePicture, region, id }, rating, category, price, about } }) {
  const navigate = useNavigate()
  return (
    <div className="w-full
                    flex gap-4 lg:gap-7 lg:p-8 lg:rounded-3xl">

      {/* Avatar + Rating */}
      <div className="relative flex-shrink-0 self-start">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="w-[120px] h-[120px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full
                          bg-gradient-to-br from-slate-300 to-slate-400
                          flex items-center justify-center text-white text-3xl lg:text-4xl">
            👤
          </div>
        )}
        {/* Rating badge */}
        <div className="absolute bottom-1 right-0 bg-primary text-white
                        rounded-full px-2 py-0.5 flex justify-center items-center leading-tight w-8 h-8">
          <span className="block text-xs font-bold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1">

        {/* Mobile: name inline with avatar (top-row) → achieved via parent flex on mobile */}
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{name}</h2>

        {/* Meta */}
        <div className="flex gap-1 flex-col lg:gap-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            {/* Hamburger / category icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>{category} -</span>
            <span className="text-teal-500 font-semibold">From {price}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            {/* Pin icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{region}</span>
          </div>
        </div>

        {/* Divider (mobile only) */}
        <hr className="border-gray-100 lg:hidden" />

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed lg:max-w-md">
          {about}
        </p>

        {/* Actions */}
        <div className="flex gap-3 lg:mt-1">
          <div className='flex-1 lg:flex-none'>
            <ButtonComponent label={"Contact"} onClick={() => navigate(`/chats/${id}`)} />
          </div>
          <button
            className="flex-1 lg:flex-none lg:px-7 border-2 border-gray-200
                       hover:border-teal-500 hover:text-teal-500
                       text-gray-800 font-semibold text-sm py-2.5 rounded-md
                       transition-colors duration-200"
          >
            Offer
          </button>
        </div>
      </div>
    </div>
  )
}

export default VendorProfileSection