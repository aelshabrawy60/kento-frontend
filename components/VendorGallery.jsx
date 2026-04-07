import React from 'react'

function VendorGallery({ data }) {

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|vtt)$/i.test(url)
  }

  return (
    <div className='columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-4'>
      {data.portfolioPosts.map((item, index) => {
        const mediaUrl = item.mediaUrls[0]

        return (
          <div key={index} className='break-inside-avoid'>
            {isVideo(mediaUrl) ? (
              <video
                className='w-full rounded-md'
                src={mediaUrl}
                controls
              />
            ) : (
              <img
                className='w-full rounded-md'
                src={mediaUrl}
                alt="portfolio"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default VendorGallery