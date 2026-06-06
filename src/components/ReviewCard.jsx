import React from 'react';
import RatingStars from './UI/RatingStars';
import { Quote } from 'lucide-react';

function ReviewCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="flex flex-col justify-between p-5 flex-1">
        {/* Stars */}
        <div className="flex items-center justify-between mb-3">
          <RatingStars value={data.value} />
          <Quote size={14} className="text-gray-200" />
        </div>

        {/* Review text */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 flex-1 mb-4">
          {data.comment}
        </p>

        {/* Reviewer */}
        <p className="text-xs font-bold text-gray-800">{data.raterName}</p>
      </div>

      {/* Image strip */}
      {data.mediaUrls?.[0] && (
        <div className="h-32 overflow-hidden">
          <img src={data.mediaUrls[0]} className="w-full h-full object-cover" alt="review" />
        </div>
      )}
    </div>
  );
}

export default ReviewCard;