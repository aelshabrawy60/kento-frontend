import React, { useState } from 'react'
import ButtonComponent from './UI/ButtonComponent'
import RequestQuoteModal from './RequestQuoteModal'
import { useNavigate } from 'react-router-dom'
import formatePrice from '../utils/formatePrice'
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiCategory } from "react-icons/bi";

function VendorProfileSection({ data: { user: { name, profilePicture, region, id }, rating, category, price, about, id: vendorId } }) {
  const navigate = useNavigate()
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  return (
    <div className='w-full flex justify-center'>
      <div className="flex-col items-center max-w-lg w-full">
        <div className='
                    flex gap-4 w-fit'>

          {/* Avatar + Rating */}
          <div className="relative shrink-0 self-start">
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
            {rating && (
              <div className="absolute bottom-1 right-0 bg-primary text-white
                        rounded-full px-2 py-0.5 flex justify-center items-center leading-tight w-8 h-8">
                <span className="block text-xs font-bold">{rating}</span>
              </div>
            )}
          </div>
          {/* Content */}
          <div className="flex flex-col gap-3 flex-1">

            {/* Mobile: name inline with avatar (top-row) → achieved via parent flex on mobile */}
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{name}</h2>

            {/* Meta */}
            <div className="flex gap-1 flex-col lg:gap-6">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                {/* Hamburger / category icon */}
                <BiCategory className="w-3.5 h-3.5 shrink-0" />
                <span>{category} -</span>
                <span className="text-primary font-semibold">From {formatePrice(price, "EGP")}</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                {/* Pin icon */}
                <HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" />
                <span>{region}</span>
              </div>
            </div>

            {/* Divider (mobile only) */}
            <hr className="border-gray-100 lg:hidden" />

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed lg:max-w-md">
              {about}
            </p>


          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3 md:mt-10 mt-4">
          <div className='flex-1 flex gap-2 mx-auto'>
            <ButtonComponent className='text-sm py-1' label={"Message"} onClick={() => navigate(`/chats/${id}`)} />
            <ButtonComponent className='text-sm py-1' label={"Request a Quote"} type="Outline" onClick={() => setIsQuoteModalOpen(true)} />
          </div>
        </div>
      </div>
      <RequestQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} vendorId={vendorId} />
    </div>
  )
}

export default VendorProfileSection