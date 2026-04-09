import React from 'react'

function VendorProfileLoading() {
  return (
    <div className='w-full flex justify-center'>
      <div className="flex-col items-center max-w-lg w-full animate-pulse">
        <div className='flex gap-4 w-full'>

          {/* Avatar + Rating */ }
          <div className="relative shrink-0 self-start">
            <div className="w-[120px] h-[120px] rounded-full bg-slate-200" />
            <div className="absolute bottom-1 right-0 rounded-full w-8 h-8 bg-slate-300" />
          </div>

          {/* Content */ }
          <div className="flex flex-col gap-3 flex-1 py-1">
            {/* Title */ }
            <div className="h-7 bg-slate-200 rounded-md w-3/4 lg:w-2/3"></div>

            {/* Meta */ }
            <div className="flex gap-2 flex-col lg:gap-6 mt-1">
              <div className="h-4 bg-slate-200 rounded-md w-1/2 lg:w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded-md w-2/5 lg:w-1/4"></div>
            </div>

            {/* Divider (mobile only) */ }
            <hr className="border-gray-100 lg:hidden my-1" />

            {/* Description */ }
            <div className="space-y-2 mt-1">
              <div className="h-3 bg-slate-200 rounded w-full lg:max-w-md"></div>
              <div className="h-3 bg-slate-200 rounded w-full lg:max-w-md"></div>
              <div className="h-3 bg-slate-200 rounded w-4/5 lg:max-w-md"></div>
            </div>
          </div>
        </div>

        {/* Actions */ }
        <div className="flex gap-3 md:mt-10 mt-4">
          <div className='flex-1 flex gap-2 mx-auto'>
            <div className="h-10 bg-slate-200 rounded-md flex-1"></div>
            <div className="h-10 bg-slate-200 rounded-md flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorProfileLoading