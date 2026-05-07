import React, { useEffect } from 'react'
import AddPackage from '../../components/AddPackage'
import PackagesViewer from '../../components/PackagesViewer';
import api from '../../api/axios'

function VendorPackagesPage() {
    const [packages, setPackages] = React.useState([])


    async function fetchPackages() {
        try {
            const response = await api.get('/vendors/packages');
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }

    useEffect(() => {
        fetchPackages();
    }, []);
    return (
        <div>
            <AddPackage packages={packages} setPackages={setPackages} />
            <div className='mt-6'></div>
            <PackagesViewer packages={packages} type="vendor" onUpdate={fetchPackages} />
        </div>
    )
}

export default VendorPackagesPage