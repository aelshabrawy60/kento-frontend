function formateStatus(status) {
    switch (status) {
        case 'PENDING':
            return <div className='text-yellow-500'>Waiting for Payment</div>
        case 'IN_PROGRESS':
            return <div className='text-green-500'>In Progress</div>
        case 'COMPLETED':
            return <div className='text-blue-500'>Completed</div>
        case 'CANCELLED':
            return <div className='text-red-500'>Cancelled</div>
        default:
            return <div className='text-gray-500'>{status}</div>
    }
}

export default formateStatus
