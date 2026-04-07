import React from 'react'
import RatingStars from './UI/RatingStars'

function ReviewCard({ data }) {
    return (
        <div className='w-full max-w-md h-42 grid grid-cols-2 overflow-hidden shadow-sm rounded-lg'>
            <div className='flex flex-col justify-between p-4'>
                <div className='flex flex-col gap-2'>
                    <div>
                        <RatingStars value={data.value} />
                    </div>
                    <div className='text-sm text-gray-800 line-clamp-3'>
                        {data.comment}
                    </div>
                </div>
                <div className='font-bold'>
                    {data.raterName}
                </div>
            </div>
            <div className='overflow-hidden'>
                <img src={data.mediaUrls[0]} className='w-full h-full object-cover'></img>
            </div>
        </div>
    )
}

export default ReviewCard