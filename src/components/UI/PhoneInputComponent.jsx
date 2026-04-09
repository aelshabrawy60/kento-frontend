"use client";

import BasePhoneInput from "react-phone-number-input";

export function PhoneInputComponent({ onChange, label, ...props }) {
  return (
    <div className="max-w-96">
      <style>{style}</style>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <BasePhoneInput
          className={className}
          onChange={onChange || (() => {})}
          {...props}
        />
      </div>
    </div>
  );
}

const className = "__phone_input_";

const style = css`
.${className} {
  --background-color: #F7FBFF;
  --foreground-color: #0f172a;
  --muted-foreground-color: #64748b;
  --border-color: #D4D7E3;
  --input-color: #e4e4e7;
  --ring-color: #a1a1aa;
  --ring-offset-color: #ffffff;
  --destructive-color: #ef4444;
}

.${className} {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--foreground-color);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.PhoneInput:focus-within {
  outline: none;
  box-shadow: var(--ring-offset-shadow), var(--ring-shadow), var(--shadow);
}

.PhoneInput:has(:disabled) {
  cursor: not-allowed;
  opacity: 0.5;
}


.PhoneInputCountry {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  position: relative;
}

.PhoneInputCountrySelect {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
  top: 0;
  left: 0;
}

.PhoneInputCountryIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.25rem;
  overflow: hidden;
  border-radius: 0.125rem;
  margin-right: 0.25rem;
}

.PhoneInputCountryIconImg {
  width: 100%;
  height: auto;
}

.PhoneInputCountrySelectArrow {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  width: 0.25rem;
  height: 0.25rem;
  border-right: 1.5px solid var(--foreground-color);
  border-bottom: 1.5px solid var(--foreground-color);
  transform: rotate(45deg) translateY(-1px);
}

.PhoneInputInput {
  flex: 1;
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: 1rem;
  color: var(--foreground-color);
}

.PhoneInputInput:focus {
  outline: none;
}

.PhoneInputInput::placeholder {
  color: var(--muted-foreground-color);
}

.PhoneInputInput:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (min-width: 768px) {
  .${className} {
    font-size: 0.875rem;
  }

  .PhoneInputInput {
    font-size: 0.875rem;
  }
}

.PhoneInput.error {
  border-color: var(--destructive-color);
}

.PhoneInput.error:focus-within {
  --ring-color: rgba(239, 68, 68, 0.3);
  box-shadow: var(--ring-offset-shadow), var(--ring-shadow), var(--shadow);
}
`;

function css(strings, ...values) {
  let raw = "";

  for (let i = 0; i < strings.length; i++) {
    raw += strings[i];
    if (i < values.length) {
      raw += values[i];
    }
  }

  return raw.replace(/\s+/g, " ").trim();
}