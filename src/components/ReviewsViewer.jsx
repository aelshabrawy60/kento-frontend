import React from 'react'
import ReviewCard from './ReviewCard'

function ReviewsViewer({ reviews }) {

    if (!reviews || reviews.length === 0) {
        return (
            <div className='flex justify-center items-center h-64'>
                <p className='text-gray-500'>No reviews found</p>
            </div>
        )
    }

    return (
        <div className='flex flex-wrap gap-4'>
            {reviews.map((review, i) => (
                <ReviewCard key={i} data={review} />
            ))}
        </div>
    )
}

export default ReviewsViewer