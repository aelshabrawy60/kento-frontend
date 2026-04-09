import React from 'react'
import VendorMiniProfile from './VendorMiniProfile'
import { Link } from 'react-router-dom'

function VendorCard({ data }) {
  return (
    <Link to={`/vendors/${data.id}`} className='max-w-md shadow-sm rounded-md p-2'>
      <div className='h-58 object-cover rounded-md overflow-hidden mb-4'>
        <img src={data.topImageUrl} className='w-full h-full object-cover' alt={data.user.name} />
      </div>
      <VendorMiniProfile data={data} />
    </Link>
  )
}

export default VendorCard
