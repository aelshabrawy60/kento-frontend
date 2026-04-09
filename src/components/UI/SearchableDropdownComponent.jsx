import { useEffect, useRef, useState } from "react";

const SearchableDropdownComponent = ({
  options,
  label,
  selectedVal,
  handleChange
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option.toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="dropdown max-w-96 relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="control relative">
        <div className="selected-value relative mt-1">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            className="block w-full px-4 py-2 rounded-md border bg-[#F7FBFF] border-[#D4D7E3] sm:text-sm outline-0"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div
            className={`arrow absolute right-[10px] top-[14px] mt-[0.3rem] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#999] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
            }`}
        ></div>
      </div>

      <div className={`options ${isOpen ? "block" : `hidden`} bg-white border border-[#ccc] shadow-[0_1px_0_rgba(0,0,0,0.06)]
            box-border mt-[-1px] max-h-[200px] overflow-y-auto
            absolute top-full w-full z-[1000]`}>
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`option box-border text-[rgba(51,51,51,0.8)] cursor-pointer block px-[10px] py-[8px] ${
                option === selectedVal ? "selected" : ""
              }`}
              key={index}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdownComponent;
