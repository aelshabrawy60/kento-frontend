import React from 'react'

function PageLoading() {
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center p-8 bg-white'>
            <div className='max-w-3xl w-full animate-pulse flex flex-col gap-8'>
                {/* Header Skeleton */}
                <div className='flex flex-col gap-4'>
                    <div className='h-10 bg-slate-200 rounded-md w-1/3'></div>
                    <div className='h-4 bg-slate-200 rounded-md w-1/4'></div>
                </div>
                
                {/* Content Blocks */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='h-64 bg-slate-100 rounded-xl w-full border border-slate-200'></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PageLoading
