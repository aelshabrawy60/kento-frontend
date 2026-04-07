import React from 'react'
import ReviewCard from './ReviewCard'

function ReviewsViewer({ reviews }) {
    return (
        <div className='flex flex-wrap gap-4 justify-center'>
            {reviews.map((review, i) => (
                <ReviewCard key={i} data={review} />
            ))}
        </div>
    )
}

export default ReviewsViewer