import React from 'react'

function VendorCardLoading() {
  return (
    <div className='max-w-md shadow-sm rounded-md p-2 w-full animate-pulse'>
      {/* Top Image Skeleton */ }
      <div className='h-58 bg-slate-200 rounded-md overflow-hidden mb-4 min-h-[200px]'></div>

      {/* Mini Profile Skeleton */ }
      <div className='flex gap-8 items-center justify-between w-full mb-1'>
        <div className='flex gap-4 w-full'>
          <div className='relative shrink-0'>
            <div className='w-18 h-18 rounded-full bg-slate-200 min-w-[72px] min-h-[72px]'></div>
            <div className='absolute flex justify-center items-center w-6 h-6 -right-2 top-1/2 -translate-y-1/2 bg-slate-300 rounded-full'></div>
          </div>
          <div className='text-sm min-w-0 flex-1 py-1 flex flex-col justify-center gap-1.5'>
            {/* Name */ }
            <div className='h-5 bg-slate-200 rounded-md w-3/4'></div>
            {/* Category and Region */ }
            <div className='h-3 bg-slate-200 rounded-md w-11/12'></div>
            {/* Price */ }
            <div className='h-4 bg-slate-200 rounded-md w-1/2 mt-1'></div>
          </div>
        </div>
        {/* Button Skeleton */ }
        <div className='h-10 w-12 bg-slate-200 rounded-md shrink-0'></div>
      </div>
    </div>
  )
}

export default VendorCardLoading