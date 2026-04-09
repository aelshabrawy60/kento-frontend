import React from 'react'
import VendorCard from './VendorCard'
import DiscoverVendorsFilter from './DiscoverVendorsFilter';
import VendorCardLoading from './Loading/VendorCardLoading';


function DiscoverVendors() {

  const [vendors, setVendors] = React.useState([])
  const [selectedRegion, setSelectedRegion] = React.useState("All");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/discover?${selectedRegion !== "All" ? `region=${selectedRegion}&` : ""}category=${selectedCategory}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVendors();
    console.log("fetching vendors with region:", selectedRegion, "and category:", selectedCategory);
  }, [selectedCategory, selectedRegion]);


  if (vendors.length === 0 && !loading) {
    return (
      <div>
        <div className='flex justify-between mb-4'>
          <h2 className='text-2xl font-bold'>Discover</h2>
          <DiscoverVendorsFilter selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>No vendors found</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Discover</h2>
        <DiscoverVendorsFilter selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <VendorCardLoading key={i} />
          ))
        ) : (
          vendors.map(vendor => (
            <VendorCard key={vendor.id} data={vendor} />
          ))
        )}
      </div>
    </div>
  )
}

export default DiscoverVendors