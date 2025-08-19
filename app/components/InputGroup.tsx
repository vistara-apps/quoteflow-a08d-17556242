
"use client";

import { useState } from "react";

interface InputGroupProps {
  label: string;
  type?: "text" | "number" | "dropdown";
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
}

export function InputGroup({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  required,
  hint
}: InputGroupProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === "number" ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === "dropdown" && options ? (
        <select
          value={value}
          onChange={handleChange}
          className="input-field w-full"
          required={required}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-field w-full ${focused ? 'border-accent' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
        />
      )}
      
      {hint && (
        <p className="text-sm text-text-secondary">{hint}</p>
      )}
    </div>
  );
}
