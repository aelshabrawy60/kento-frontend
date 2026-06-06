import React from 'react';
import VendorCard from './VendorCard';
import DiscoverVendorsFilter from './DiscoverVendorsFilter';
import VendorCardLoading from './Loading/VendorCardLoading';
import { Search } from 'lucide-react';

function DiscoverVendors() {
  const [vendors, setVendors]                   = React.useState([]);
  const [selectedRegion, setSelectedRegion]     = React.useState('All');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [minPrice, setMinPrice]                 = React.useState('');
  const [maxPrice, setMaxPrice]                 = React.useState('');
  const [loading, setLoading]                   = React.useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/clients/discover?${selectedRegion !== 'All' ? `region=${selectedRegion}&` : ''}category=${selectedCategory}`;
      if (minPrice || maxPrice) url += `&priceRange=${minPrice}-${maxPrice}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const delay = setTimeout(() => { fetchVendors(); }, 500);
    return () => clearTimeout(delay);
  }, [selectedCategory, selectedRegion, minPrice, maxPrice]);

  const hasActiveFilter = selectedRegion !== 'All' || selectedCategory || minPrice || maxPrice;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Discover</h2>
          {!loading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {vendors.length} photographer{vendors.length !== 1 ? 's' : ''} available
              {hasActiveFilter ? ' · filtered' : ''}
            </p>
          )}
        </div>
        <DiscoverVendorsFilter
          selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        />
      </div>

      {/* Active filter chips */}
      {hasActiveFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRegion !== 'All' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              📍 {selectedRegion}
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              🎨 {selectedCategory}
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              💰 {minPrice || '0'} – {maxPrice || '∞'} EGP
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VendorCardLoading key={i} />)
          : vendors.length === 0
          ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search size={26} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-600">No vendors found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters to see more results.</p>
            </div>
          )
          : vendors.map(vendor => <VendorCard key={vendor.id} data={vendor} />)
        }
      </div>
    </div>
  );
}

export default DiscoverVendors;