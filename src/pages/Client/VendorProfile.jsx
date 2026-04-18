import React, { useEffect } from 'react'
import VendorProfileSection from '../../components/VendorProfileSection'
import axios from 'axios'
import VendorGallery from '../../components/VendorGallery';
import ReviewsViewer from '../../components/ReviewsViewer';
import RadioButtonsGroup from '../../components/UI/RadioButtonsGroup';
import VendorProfileLoading from '../../components/Loading/VendorProfileLoading';

function VendorProfile() {
  const [vendorData, setVendorData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState('gallery');

  const fetchVendorData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients/vendors/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
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
        <VendorProfileLoading />
      ) : (
        <>
          <VendorProfileSection data={vendorData} />
          <div className='mt-6'></div>
          <RadioButtonsGroup options={[
            { label: 'Gallery', value: 'gallery' },
            { label: 'Reviews', value: 'reviews' }
          ]} selected={selectedTab} onChange={setSelectedTab} />
          <div className='mt-6'></div>
          {selectedTab === 'gallery' ? (
            <VendorGallery data={vendorData} />
          ) : (
            <ReviewsViewer reviews={vendorData.reviews} />
          )}
        </>
      )}
    </div>
  )
}

export default VendorProfile