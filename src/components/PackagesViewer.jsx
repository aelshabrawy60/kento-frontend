import React from 'react'
import PackageCard from './PackageCard'

function PackagesViewer({ packages, type = "client", onUpdate, vendorData }) {

    if (packages && packages.length > 0) {
        return (
            <div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {packages?.map((pkg, index) => {
                        return (
                            <PackageCard key={index} data={pkg} type={type} onUpdate={onUpdate} vendorData={vendorData} />
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center items-center h-64'>
            <p className='text-gray-500'>No packages found</p>
        </div>
    )

}

export default PackagesViewer