import React from 'react'
import SearchableDropdownComponent from './UI/SearchableDropdownComponent'
import SelectComponent from './UI/SelectComponent'
import ModalComponent from './UI/ModalComponent'
import { FaFilter } from "react-icons/fa";
import ButtonComponent from './UI/ButtonComponent';


const regions = [
  "All",
  "Cairo",
  "Giza",
  "Alexandria",
  "Aswan",
  "Luxor",
  "Suez",
  "Port Said",
  "Ismailia",
  "Fayoum",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Asyut",
  "Red Sea",
  "New Valley",
  "Matrouh",
  "North Sinai",
  "South Sinai"
]

const categories = [
  "Events",
  "Portrait",
  "Products",
]

function DiscoverVendorsFilter({ selectedRegion, setSelectedRegion, selectedCategory, setSelectedCategory }) {


  return (
    <ModalComponent openButtonType='Outline' title="Filter Vendors" buttonLabel={<FaFilter />} confirmLabel={"Confirm"} className='flex gap-5'>
      <div className='max-w-sm flex flex-col gap-2'>
        <SearchableDropdownComponent label={"Region"} options={regions} selectedVal={selectedRegion} handleChange={setSelectedRegion} />
        <SelectComponent label={"Category"} options={categories} selectedVal={selectedCategory} handleChange={setSelectedCategory} />
      </div>
    </ModalComponent>
  )
}

export default DiscoverVendorsFilter