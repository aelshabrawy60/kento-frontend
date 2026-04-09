import React from 'react'
function RadioButtonsGroup({ options, selected, onChange, label }) {
    return (
        <div>
            {label && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {label}
                </p>
            )}
            <div className="flex gap-2">
                {options.map((option) => {
                    const isSelected = selected === option.value
                    return (
                        <label
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={`flex-1 flex flex-col items-center gap-0.5 px-4 py-2 md:py-3 cursor-pointer text-center
                ${isSelected
                                    ? 'border-primary border-b-2'
                                    : 'bg-white'
                                }`}
                        >
                            <input
                                type="radio"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => onChange(option.value)}
                                className="hidden"
                            />
                            <span className={`text-sm ${isSelected ? 'font-medium text-primary' : 'font-normal text-gray-900'}`}>
                                {option.label}
                            </span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
export default RadioButtonsGroup