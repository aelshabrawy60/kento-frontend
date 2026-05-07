import React from 'react';
import SearchableDropdownComponent from './SearchableDropdownComponent';

const regions = [
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
];

function RegionInputComponent({ region, setRegion, label = "Location" }) {
    return (
        <SearchableDropdownComponent 
            label={label} 
            options={regions} 
            handleChange={setRegion} 
            selectedVal={region} 
        />
    );
}

export default RegionInputComponent;
