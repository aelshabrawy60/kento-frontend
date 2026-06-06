import React from 'react';
import { useParams } from 'react-router-dom';
import VendorProfileSection from '../../components/VendorProfileSection';
import api from '../../api/axios';
import VendorGallery from '../../components/VendorGallery';
import ReviewsViewer from '../../components/ReviewsViewer';
import VendorProfileLoading from '../../components/Loading/VendorProfileLoading';
import PackagesViewer from '../../components/PackagesViewer';
import { Images, Package, Star } from 'lucide-react';

const TABS = [
  { value: 'gallery',  label: 'Gallery',   icon: <Images size={15} /> },
  { value: 'packages', label: 'Packages',  icon: <Package size={15} /> },
  { value: 'reviews',  label: 'Reviews',   icon: <Star size={15} /> },
];

function VendorProfile() {
  const [vendorData, setVendorData]   = React.useState({});
  const [loading, setLoading]         = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState('gallery');

  React.useEffect(() => {
    const vendorId = window.location.pathname.split('/').pop();
    setLoading(true);
    api.get(`/clients/vendors/${vendorId}`)
      .then(res => setVendorData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <VendorProfileLoading />;

  return (
    <div className="pb-10">
      {/* Cover image */}
      {vendorData.topImageUrl && (
        <div className="relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden mb-0"
          style={{ background: 'linear-gradient(135deg, #008D87 0%, #003d3b 100%)' }}>
          <img src={vendorData.topImageUrl} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
        </div>
      )}

      {/* Profile section card */}
      <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-7 mb-5 ${vendorData.topImageUrl ? '-mt-8 relative z-10 mx-1' : ''}`}>
        <VendorProfileSection data={vendorData} />
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-gray-100/80 rounded-2xl p-1 mb-5 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedTab === tab.value
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {selectedTab === 'gallery'  && <VendorGallery data={vendorData} />}
        {selectedTab === 'reviews'  && <ReviewsViewer reviews={vendorData.reviews} />}
        {selectedTab === 'packages' && <PackagesViewer packages={vendorData.packages} vendorData={vendorData} />}
      </div>
    </div>
  );
}

export default VendorProfile;