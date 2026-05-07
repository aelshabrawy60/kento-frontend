import React, { useEffect } from 'react'
import VendorProfileSection from '../../components/VendorProfileSection'
import api from '../../api/axios'
import VendorGallery from '../../components/VendorGallery';
import ReviewsViewer from '../../components/ReviewsViewer';
import RadioButtonsGroup from '../../components/UI/RadioButtonsGroup';
import VendorProfileLoading from '../../components/Loading/VendorProfileLoading';
import UploadImgs from '../../components/UI/UploadImgs';
import PackagesViewer from '../../components/PackagesViewer';

function VendorProfile() {
  const [vendorData, setVendorData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState('gallery');

  const fetchVendorData = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/clients/vendors/${id}`);
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
            { label: 'Packages', value: 'packages' },
            { label: 'Reviews', value: 'reviews' }
          ]} selected={selectedTab} onChange={setSelectedTab} />
          <div className='mt-6'></div>
          {selectedTab === 'gallery' ? (
            <VendorGallery data={vendorData} />
          ) : selectedTab === 'reviews' ? (
            <ReviewsViewer reviews={vendorData.reviews} />
          ) : selectedTab === 'packages' ? (
            <PackagesViewer packages={vendorData.packages} vendorData={vendorData} />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  )
}

export default VendorProfile