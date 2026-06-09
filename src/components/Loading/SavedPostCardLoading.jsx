import React from 'react'

function SavedPostCardLoading() {
    return (
        <div className='max-w-md shadow-sm rounded-md p-2 w-full animate-pulse'>
            {/* Top Image Skeleton */}
            <div className='h-58 bg-slate-200 rounded-md overflow-hidden mb-4 min-h-[200px]'></div>

            {/* VendorMiniProfile Skeleton */}
            <div className='flex gap-4 items-center w-full'>
                <div className='w-12 h-12 rounded-full bg-slate-200 min-w-[48px]'></div>
                <div className='flex flex-col justify-center gap-2 w-full'>
                    <div className='h-4 bg-slate-200 rounded-md w-1/2'></div>
                    <div className='h-3 bg-slate-200 rounded-md w-1/3'></div>
                </div>
            </div>
        </div>
    )
}

export default SavedPostCardLoading
