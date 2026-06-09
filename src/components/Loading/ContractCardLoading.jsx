import React from 'react'

function ContractCardLoading() {
    return (
        <div className='max-w-md shadow-sm rounded-md p-2 animate-pulse'>
            <div className='mb-4'>
                {/* Status Badge */}
                <div className='h-6 w-24 bg-slate-200 rounded-full mb-3'></div>
                
                <div className='flex gap-4 mb-4'>
                    {/* Date */}
                    <div className='h-5 w-28 bg-slate-200 rounded-md'></div>
                    {/* Price */}
                    <div className='h-5 w-24 bg-slate-200 rounded-md'></div>
                </div>
                
                {/* Description lines */}
                <div className='h-4 bg-slate-200 rounded-md w-full mb-2'></div>
                <div className='h-4 bg-slate-200 rounded-md w-5/6 mb-2'></div>
                <div className='h-4 bg-slate-200 rounded-md w-3/4'></div>
            </div>
            
            {/* VendorMiniProfile Skeleton */}
            <div className='flex gap-4 items-center w-full mt-4'>
                <div className='w-12 h-12 rounded-full bg-slate-200 min-w-[48px]'></div>
                <div className='flex flex-col justify-center gap-2 w-full'>
                    <div className='h-4 bg-slate-200 rounded-md w-1/2'></div>
                    <div className='h-3 bg-slate-200 rounded-md w-1/3'></div>
                </div>
            </div>
        </div>
    )
}

export default ContractCardLoading
