import React from 'react'
import ButtonComponent from './UI/ButtonComponent'
import { IoChatbubblesSharp } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiCategory } from "react-icons/bi";
import formatePrice from '../src/utils/formatePrice';
import { Link } from 'react-router-dom';



function VendorMiniProfile({ data }) {
    return (
        <div className='flex gap-8 items-center justify-between w-full mb-1'>
            <div className='flex gap-4'>
                <div className='relative'>
                    <img className='w-18 h-18 rounded-full object-cover' src={data.user.profilePicture} alt={data.user.name} />
                    {data.rating && (
                        <div className='absolute flex justify-center items-center w-6 h-6 -right-2 top-1/2 -translate-y-1/2 text-xs bg-primary text-white rounded-full'>
                            {data.rating}
                        </div>
                    )}

                </div>
                <div className='text-sm min-w-0'>
                    <div className='font-bold text-md truncate'>{data.user.name}</div>
                    <div className='flex gap-1 text-gray-600 mb-2'>
                        <div className='flex justify-center items-center gap-1'>
                            <BiCategory size={14} />
                            <div>{data.category}</div>
                        </div>
                        <div>-</div>
                        <div className='flex justify-center items-center gap-1'>
                            <HiOutlineLocationMarker size={14} />
                            <div>{data.user.region}</div>
                        </div>
                    </div>
                    <div className='text-primary font-medium'>
                        From <span className=''>{formatePrice(data.price, 'EGP')}</span>
                    </div>
                </div>
            </div>
            <Link to={`/chats/${data.user.id}`} className='h-full'>
                <ButtonComponent label={<IoChatbubblesSharp />} className='h-full' />
            </Link>
        </div>
    )
}

export default VendorMiniProfile