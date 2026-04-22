import React from 'react'
import VendorCard from './VendorCard'
import DiscoverVendorsFilter from './DiscoverVendorsFilter';
import VendorCardLoading from './Loading/VendorCardLoading';


function DiscoverVendors() {

  const [vendors, setVendors] = React.useState([])
  const [selectedRegion, setSelectedRegion] = React.useState("All");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/clients/discover?${selectedRegion !== "All" ? `region=${selectedRegion}&` : ""}category=${selectedCategory}`;
      if (minPrice || maxPrice) {
        url += `&priceRange=${minPrice}-${maxPrice}`;
      }
      const response = await fetch(url, {
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
    // Only fetch if inputs are empty or after user finished typing (optional optimization)
    // Here we'll just fetch whenever changes occur like the original behavior.
    const delayDebounceFn = setTimeout(() => {
      fetchVendors();
      console.log("fetching vendors with region:", selectedRegion, "category:", selectedCategory, "priceRange:", `${minPrice}-${maxPrice}`);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, selectedRegion, minPrice, maxPrice]);


  if (vendors.length === 0 && !loading) {
    return (
      <div>
        <div className='flex justify-between mb-4'>
          <h2 className='text-2xl font-bold'>Discover</h2>
          <DiscoverVendorsFilter 
            selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} 
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          />
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
        <DiscoverVendorsFilter 
          selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} 
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        />
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