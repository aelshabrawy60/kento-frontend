import React from 'react'
import { governorates } from '../data/egyptLocations'
import SelectComponent from './UI/SelectComponent'
import ModalComponent from './UI/ModalComponent'
import InputComponent from './UI/InputComponent'
import { SlidersHorizontal } from 'lucide-react';

import { useCategories } from '../hooks/useCategories';

const regions = ["All", ...governorates];

function DiscoverVendorsFilter({ selectedRegion, setSelectedRegion, selectedCategory, setSelectedCategory, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  const { categories } = useCategories();

  return (
    <ModalComponent 
      openButtonType='Outline' 
      title="Filter Photographers" 
      buttonLabel={<div className="flex items-center gap-2"><SlidersHorizontal size={18} /><span>Filter</span></div>} 
      confirmLabel={"Apply Filters"} 
      overflowVisible={true}
    >
      <div className='flex flex-col gap-6'>
        <SelectComponent 
          label={"Governorate"} 
          options={regions} 
          selectedVal={selectedRegion} 
          handleChange={setSelectedRegion} 
        />
        <SelectComponent 
          label={"Photography Category"} 
          options={categories} 
          selectedVal={selectedCategory} 
          handleChange={setSelectedCategory} 
        />
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Price Range (EGP)</label>
          <div className="flex gap-4 items-center">
            <InputComponent 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)} 
              placeholder="Min Price" 
            />
            <div className="text-gray-300 font-bold">-</div>
            <InputComponent 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
              placeholder="Max Price" 
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  )
}

export default DiscoverVendorsFilter