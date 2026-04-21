import React from 'react'
import { Link } from 'react-router-dom'
import VendorMiniProfile from './VendorMiniProfile'

function SavedPostCard({ data }) {

    return (
        <Link to={`/vendors/${data.post.vendor.id}`} className='max-w-md shadow-sm rounded-md p-2'>
            <div className='h-58 object-cover rounded-md overflow-hidden mb-4'>
                <img src={data.post.mediaUrls[0]} className='w-full h-full object-cover' alt={data.post.vendor.user.name} />
            </div>
            <VendorMiniProfile data={data.post.vendor} />
        </Link>
    )
}

export default SavedPostCard