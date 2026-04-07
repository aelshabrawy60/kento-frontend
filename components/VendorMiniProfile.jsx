import React from 'react'
import ButtonComponent from './UI/ButtonComponent'
import { IoChatbubblesSharp } from "react-icons/io5";


function VendorMiniProfile({data}) {
  return (
    <div className='flex gap-8 items-center justify-between w-full mb-1'>
        <div className='flex gap-4'>
            <div className='relative'>
                <img className='w-18 h-18 rounded-full object-cover'  src={data.user.profilePicture} alt={data.user.name} />
                <div className='absolute flex justify-center items-center w-6 h-6 -right-2 top-1/2 -translate-y-1/2 text-xs bg-primary text-white rounded-full'>
                    {data.rating}
                </div>
            </div>
            <div className='text-sm min-w-0'>
                <div className='font-bold text-md truncate'>{data.user.name}</div>
                <div className='flex gap-1 text-gray-600 mb-2'>
                    <div>{data.category}</div>
                    <div>-</div>
                    <div>{data.user.region}</div>
                </div>
                <div className='text-primary font-medium'>
                    from <span className=''>{data.price}</span> EGP
                </div>
            </div>
        </div>
        <div className='h-full'>
            <ButtonComponent label={<IoChatbubblesSharp />} className='h-full'/>
        </div>
    </div>
  )
}

export default VendorMiniProfile