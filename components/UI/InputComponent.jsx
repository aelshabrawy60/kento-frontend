import { useState } from "react";
import {Eye, EyeOff} from "lucide-react"
function InputComponent({ label, placeholder, value, onChange, type }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="max-w-96">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <input
          type={inputType}
          placeholder={placeholder}
          className="block w-full px-4 py-2 rounded-md border bg-[#F7FBFF] border-[#D4D7E3] sm:text-sm outline-0 pr-10"
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off icon
              <EyeOff size={18}/>
            ) : (
              // Eye icon
              <Eye size={18}/>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputComponent;