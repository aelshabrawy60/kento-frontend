import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"

function InputComponent({ label, placeholder, value, onChange, type }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          className={`block w-full px-4 py-2.5 rounded-xl border bg-white border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_0_3px_rgba(0,141,135,0.15)] transition-all duration-200 outline-none sm:text-sm shadow-sm ${isPassword ? 'pr-10' : ''}`}
          value={value}
          onChange={onChange}
          name={label || placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputComponent;