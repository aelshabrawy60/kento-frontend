import React from 'react'
import SavePost from './SavePost'

function VendorGallery({ data }) {

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|vtt)$/i.test(url)
  }

  if (!data.portfolioPosts || data.portfolioPosts.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500'>No portfolio posts found</p>
      </div>
    )
  }

  return (
    <div className='columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-4'>
      {data.portfolioPosts.map((item, index) => {
        const mediaUrl = item.mediaUrls[0]

        return (
          <div 
            key={index} 
            className='break-inside-avoid relative group select-none'
            onDoubleClick={(e) => {
              const btn = e.currentTarget.querySelector('.save-post-btn');
              if (btn) btn.click();
            }}
          >
            {isVideo(mediaUrl) ? (
              <video
                className='w-full rounded-lg'
                src={mediaUrl}
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                className='w-full rounded-lg pointer-events-none'
                src={mediaUrl}
                alt="portfolio"
              />
            )}
            <SavePost 
              postId={item.id} 
              defaultSaved={item.isSaved} 
              className='hidden md:block md:opacity-0 md:group-hover:opacity-100'
            />
          </div>
        )
      })}
    </div>
  )
}

export default VendorGallery