import React from 'react'
import { Link } from 'react-router-dom'
import VendorMiniProfile from './VendorMiniProfile'
import formatePrice from '../utils/formatePrice'
import { FaCalendarAlt } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import formateStatus from '../utils/formateContractStatus.jsx';


function ContractCard({ data }) {

    function formateDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        })
    }

    return (
        <Link to={`/contracts/${data.id}`} className='max-w-md shadow-sm rounded-md p-2'>
            <div className='mb-4'>
                <div className='mb-2'>
                    {formateStatus(data.status)}
                </div>
                <div className='flex gap-4 mb-4'>
                    <div className='flex items-center gap-2'>
                        <FaCalendarAlt className='text-primary' />
                        {formateDate(data.startDate)}
                    </div>
                    <div className='flex items-center gap-2'>
                        <FaMoneyBills className='text-primary' />
                        {formatePrice(data.price, 'EGP')}
                    </div>
                </div>
                <div>
                    {data.description.substring(0, 100)}
                </div>
            </div>
            <VendorMiniProfile data={data.vendor} />
        </Link>
    )
}

export default ContractCard