import React from 'react'
import ClientOnboard from '../../components/ClientOnboard'

function ClientOnboardPage() {
  return (
    <div className='md:h-screen p-6 flex justify-center'>
        <div className='grid md:grid-cols-2 h-full max-w-300 gap-6'>
            <div className='flex items-center max-h-[200px] md:max-h-none overflow-hidden rounded-lg md:order-2'>
                <img src='/ClientOnboard.jpg' className='w-full h-fit object-cover rounded-lg'/>
            </div>
            <div className='flex justify-center items-center gap-6 md:order-1'>
                <div className='max-w-96'>
                    <div className='text-xl md:text-3xl mb-2 font-bold'>
                      Complete your profile
                    </div>
                    <div className='text-sm text-gray-500 mb-6'>
                      Please provide the following information to complete your profile.
                    </div>
                    <ClientOnboard/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ClientOnboardPage