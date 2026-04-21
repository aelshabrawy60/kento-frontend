import React from 'react'
import ContractCard from './ContractCard'

function Contracts() {
    const [contracts, setContracts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/contracts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            setContracts(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchContracts();
    }, []);

    if (loading) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Contracts</h2>
            </div>
        )
    }

    if (contracts.length === 0 && !loading) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Contracts</h2>
                <p className='text-gray-500'>No contracts found</p>
            </div>
        )
    }

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h2 className='text-2xl font-bold'>Contracts</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
                {contracts.map(contract => (
                    <ContractCard key={contract.id} data={contract} />
                ))}
            </div>
        </div>
    )
}

export default Contracts