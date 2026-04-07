import React from 'react'
import VendorCard from './VendorCard'
import DiscoverVendorsFilter from './DiscoverVendorsFilter';


function DiscoverVendors() { 

  const [vendors, setVendors] = React.useState([])
  const [selectedRegion, setSelectedRegion] = React.useState("All");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const fetchVendors = async () => {
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
    }
  };

  React.useEffect(() => {
    fetchVendors();
    console.log("fetching vendors with region:", selectedRegion, "and category:", selectedCategory);
  }, [selectedCategory, selectedRegion]);


  return (
    <div>
        <div className='flex justify-between mb-4'>
            <h2 className='text-2xl font-bold'>Discover</h2>
            <DiscoverVendorsFilter selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
            {vendors.map(vendor => (
                <div key={vendor.id} className=''>
                    <VendorCard data={vendor}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DiscoverVendors