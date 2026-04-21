import React from 'react'
import VendorMiniProfile from '../../components/VendorMiniProfile';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import formateStatus from '../../utils/formateContractStatus';
import formatePrice from '../../utils/formatePrice';
import { FaCalendarAlt, FaMoneyBill } from 'react-icons/fa';

function ClientContractPage({ }) {

    // get contract id from the param
    const { id } = useParams();
    const [contract, setContract] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { isAuthenticated } = useAuth();

    function formateDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        })
    }

    const fetchContract = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/contracts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            setContract(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching contract:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchContract();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/client/login" />;
    }

    if (loading) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Contract</h2>
            </div>
        )
    }

    if (!contract && !loading) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Contract</h2>
                <p className='text-gray-500'>Contract not found</p>
            </div>
        )
    }

    return (
        <div>
            <h2 className='text-2xl font-bold mb-8'>Contract</h2>
            <div>
                <div className='mb-8'>
                    {formateStatus(contract.status)}
                </div>
                <div className='flex gap-6 justify-start flex-wrap mb-8'>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <FaCalendarAlt className='text-primary' />
                            <div className='text-gray-600'>Start Date</div>
                        </div>
                        {formateDate(contract.startDate)}
                    </div>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <FaMoneyBill className='text-primary' />
                            <div className='text-gray-600'>Total Price</div>
                        </div>
                        {formatePrice(contract.price, 'EGP')}
                    </div>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <FaMoneyBill className='text-primary' />
                            <div className='text-gray-600'>Deposit</div>
                        </div>
                        {formatePrice(contract.deposit, 'EGP')}
                    </div>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <FaMoneyBill className='text-primary' />
                            <div className='text-gray-600'>Remaining</div>
                        </div>
                        {formatePrice(contract.price - contract.deposit, 'EGP')}
                    </div>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <FaCalendarAlt className='text-primary' />
                            <div className='text-gray-600'>Delivery Date</div>
                        </div>
                        {formateDate(contract.deliveryDate)}
                    </div>
                </div>
                <VendorMiniProfile data={contract.vendor} />
            </div>
            <div className='mt-8'>
                <div>
                    <div className='mb-4 font-bold'>Description</div>
                    <p className='text-gray-600'>{contract.description}</p>
                </div>
            </div>
        </div>
    )
}

export default ClientContractPage