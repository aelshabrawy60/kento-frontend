import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

function SelectComponent({ selectedVal, handleChange, options, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>}
      <div
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white cursor-pointer transition-all duration-300 select-none ${isOpen ? 'border-primary shadow-[0_0_0_3px_rgba(0,141,135,0.15)] ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${!selectedVal ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
          {selectedVal || "Select an option"}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-1.5 max-h-60 overflow-y-auto transform origin-top transition-all duration-200">
          <div
            className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors duration-150 mx-1.5 rounded-lg ${!selectedVal ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => { handleChange(""); setIsOpen(false); }}
          >
            <span className="flex-1 truncate">Select an option</span>
            {!selectedVal && <Check size={16} className="text-primary ml-2" />}
          </div>
          {options.map((option) => (
            <div
              key={option}
              className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors duration-150 mx-1.5 rounded-lg mt-0.5 ${selectedVal === option ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => { handleChange(option); setIsOpen(false); }}
            >
              <span className="flex-1 truncate">{option}</span>
              {selectedVal === option && <Check size={16} className="text-primary ml-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectComponent