import React from 'react'

function SelectComponent({selectedVal, handleChange, options, label}) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <select value={selectedVal} onChange={(e) => handleChange(e.target.value)} className='block w-full px-4 py-2 rounded-md border bg-[#F7FBFF] border-[#D4D7E3] sm:text-sm outline-0 mt-1'>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectComponent