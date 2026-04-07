import React, { useEffect } from 'react'
import VendorProfileSection from '../../components/VendorProfileSection'
import axios from 'axios'
import VendorGallery from '../../components/VendorGallery';

function VendorProfile() {
  const [vendorData, setVendorData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const fetchVendorData = async (id) => {
    setLoading(true);
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients/vendors/${id}`);
        setVendorData(response.data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    // get vendor id from url params
    const vendorId = window.location.pathname.split('/').pop();
    fetchVendorData(vendorId);
  }, []);
    
  return (
    <div>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <>
            <VendorProfileSection data={vendorData}/>
            <div className='mt-6'></div>
            <VendorGallery data={vendorData}/>
            </>
        )}
    </div>
  )
}

export default VendorProfile